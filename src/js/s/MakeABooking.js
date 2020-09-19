// Zones/MakeABooking.aspx

// Vars
var dtOptions = {
	singleDatePicker: true,
	timePicker: true,
	autoApply: true,
	opens: "left",
	minDate: moment().format('DD/MM/YYYY'),
	minYear: parseInt(moment().format('YYYY'), 10),
	locale: {
		format: 'DD/MM/YYYY hh:mm A'
	}
};
var routeFromSelectEl;
var routeToSelectEl;
var paxCountEl;
var departDateEl;
var returnDateEl;

var costEl;
var costBreakdownEl;

// On Document Ready
$(function () {
	routeFromSelectEl = $("#RouteFrom");
	routeToSelectEl = $("#RouteTo");
	paxCountEl = $("#RoutePax");
	departDateEl = $("#DepartPickUpDateTime");
	returnDateEl = $("#ReturnPickUpDateTime");
	costEl = $("#cost");
	costBreakdownEl = $("#costBreakdown");

	loadListData();
	routeFromSelectEl.on("change", loadToListData);
	routeToSelectEl.on("change", getUpdatedCost);
	paxCountEl.on("change", getUpdatedCost);

	departDateEl.daterangepicker(dtOptions,
		function (start, end, label) {
			console.log("A new date depart selection was made: " + start.format('DD/MM/YYYY hh:mm A') + ' to ' + end.format('DD/MM/YYYY hh:mm A'));

			console.log($(this));
			console.log($('#DepartPickUpDateTime'));

			$('#ReturnPickUpDateTime').data('daterangepicker').setStartDate(start.format('DD/MM/YYYY'));

			setTimeout(getUpdatedCost, 25);
		});

	returnDateEl.daterangepicker(dtOptions,
		function (start, end, label) {
			console.log("A new date return selection was made: " + start.format('DD/MM/YYYY hh:mm A') + ' to ' + end.format('DD/MM/YYYY hh:mm A'));

			setTimeout(getUpdatedCost, 25);
		});
});

function loadListData() {
	doAjaxPost("MakeABooking.aspx/GetListData",
		{},
		function (data) {
			console.log("    loadListData -> Success");

			$.each(data.From, function (index, item) {
				var option = $("<option>")
					.attr("value", item)
					.html(item);

				routeFromSelectEl.append(option);
			});

			populateToSelect(data.To);
		},
		function () {
			console.log("    loadListData -> Complete");
		});
}

function loadToListData() {
	var data = {
		from: routeFromSelectEl.val()
	};

	doAjaxPost("MakeABooking.aspx/GetToListData",
		data,
		function (data) {
			console.log("    loadToListData -> Success");
			populateToSelect(data);
		},
		function () {
			console.log("    loadToListData -> Complete");
		});
}

function populateToSelect(data) {
	routeToSelectEl.empty();
	routeToSelectEl.append(
		$("<option disabled selected>").html("Choose...")
	);

	$.each(data, function (index, item) {
		var option = $("<option>")
			.attr("value", item)
			.html(item);

		routeToSelectEl.append(option);
	});

	costEl.html("Make a selection");
	costBreakdownEl.empty();
}

// on the fly udpating
function getUpdatedCost() {
	var d = {
		data: {
			from: routeFromSelectEl.val(),
			to: routeToSelectEl.val(),
			paxCount: paxCountEl.val(),
			departDate: departDateEl.val(),
			returnDate: returnDateEl.val()
		}
	};

	doAjaxPost("MakeABooking.aspx/GetCost",
		d,
		function (data) {
			console.log("  getUpdatedCost -> Success");

			if (!data.success) return;

			costEl.html(data.cost);

			costBreakdownEl.empty();

			$.each(data.breakdown, function (index, item) {
				var li = $("<li>").html(item);

				costBreakdownEl.append(li);
			});
		},
		function () {
			console.log("  getUpdatedCost -> Complete");
		});
}