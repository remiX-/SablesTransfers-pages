// Admin/Dashboard.aspx

// Vars
var routeAddEl;
var rateTableEl;
var rateTableTbodyEl;
var rateModalEl;

var modalAction;
var modalTargetData;
var modalTitleEl;
var modalFromEl;
var modalToEl;
var modalPax1El;
var modalPax2El;
var modalPax3El;
var modalSubmitBtnEl;

// On Document Ready
$(function () {
	routeAddEl = $("#route-add");
	rateTableEl = $("#rate-group-data");
	rateTableTbodyEl = rateTableEl.find("tbody");
	rateModalEl = $("#rate-group-data-modal");

	loadRateGroupData();

	rateModalEl.on("show.bs.modal", rateModalOnShow);
});

function loadRateGroupData() {
	showSpinner("rate-group");
	rateTableTbodyEl.empty();
	rateTableEl.addClass("hide");

	doAjaxPost("Dashboard.aspx/GetRateGroups",
		{},
		function (data) {

			$.each(data.Items, function (index, item) {
				console.log(item + " -> " + index);

				var tr = $("<tr>")
					.attr("data-index", index)
					.attr("data-toggle", "modal")
					.attr("data-target", "#rate-group-data-modal");

				tr.append($("<td>").html(item.Route.From))
					.append($("<td>").html(item.Route.To))
					.append($("<td>").html(item.PaxGroupCostsFormatted[0]))
					.append($("<td>").html(item.PaxGroupCostsFormatted[1]))
					.append($("<td>").html(item.PaxGroupCostsFormatted[2]));

				rateTableTbodyEl.append(tr);
			});
		},
		function () {
			hideSpinner("rate-group");

			rateTableEl.removeClass("hide");
			rateTableEl.DataTable();
		}
	);
}

function rateModalOnShow(event) {
	var modal = $(this);

	if (modalTitleEl === undefined) {
		modalTitleEl = modal.find("#rate-modal-title");
		modalFromEl = modal.find("#rate-modal-from");
		modalToEl = modal.find("#rate-modal-to");
		modalPax1El = modal.find("#rate-modal-pax1");
		modalPax2El = modal.find("#rate-modal-pax2");
		modalPax3El = modal.find("#rate-modal-pax3");
		modalSubmitBtnEl = modal.find("#modal-submit");
		modalSubmitBtnEl.on("click", rateModalOnSubmit);
	}

	var target = $(event.relatedTarget);
	modalAction = target.data("for");
	if (modalAction === "add") {
		modalTitleEl.text("Add a Route");
		modalFromEl.val("");
		modalToEl.val("");
		modalPax1El.val("");
		modalPax2El.val("");
		modalPax3El.val("");
		modalSubmitBtnEl.text("Create");

		modalFromEl.removeAttr("readonly");
		modalToEl.removeAttr("readonly");
	} else {
		modalTargetData = target.data("index");
		var data = { index: modalTargetData };

		doAjaxPost("Dashboard.aspx/GetRateGroupInfo",
			data,
			function (data) {
				modalTitleEl.text(`Route costs for ${data.From} -> ${data.To}`);
				modalFromEl.val(data.From);
				modalToEl.val(data.To);
				modalPax1El.val(data.Pax1);
				modalPax2El.val(data.Pax2);
				modalPax3El.val(data.Pax3);

				modalSubmitBtnEl.text("Update");
				modalFromEl.attr("readonly", "");
				modalToEl.attr("readonly", "");
			},
			function () { }
		);
	}
}

function rateModalOnSubmit() {
	var d = {
		data: {
			from: modalFromEl.val(),
			to: modalToEl.val(),
			pax1: modalPax1El.val(),
			pax2: modalPax2El.val(),
			pax3: modalPax3El.val()
		}
	};

	var url;

	if (modalAction === "add") {
		url = "Dashboard.aspx/AddRateGroup";
	} else {
		url = "Dashboard.aspx/UpdateRateGroup";
		d.index = modalTargetData;
	}

	doAjaxPost(url,
		d,
		function (data) {
			console.log("i need to reload this page now");
		},
		function () {
			rateModalEl.modal("hide");
			location.reload();
		}
	);
}