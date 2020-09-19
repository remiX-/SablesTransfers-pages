// Zones/ManageBookings.aspx

// Vars
var bookingTableEl;
var bookingModalEl;
var bookingModalId;

var actionBtnTemplate;
var actionColTemplate;

// On Document Ready
$(function () {
	bookingTableEl = $("#bookings-data");
	bookingModalEl = $("#bookings-modal");
	bookingModalId = "bookings-modal";

	actionBtnTemplate = "<button type='button' class='btn text-success p-1' data-tooltip='tooltip' title='aaa invoice'>";
	actionColTemplate = "<button type='button' class='btn text-success p-1' data-tooltip='tooltip' title='create invoice'> \
<i class='fas fa-file-download'></i> \
</button> \
<button type='button' class='btn text-danger p-1' data-tooltip='tooltip' title='delete booking'> \
<i class='fas fa-trash'></i> \
</button>";

	loadBookingData();

	// events
	bookingModalEl.on("show.bs.modal", bookingModalOnShow);
});

function loadBookingData() {
	doAjaxPost("ManageBookings.aspx/GetBookingData",
		{},
		function (data) {
			var tbodyEl = bookingTableEl.find("tbody");

			$.each(data.Items, function (index, item) {
				console.log(item + ' -> ' + index);

				var tr = $("<tr>").attr("data-id", item.Id);

				//				var actionCol = $(actionColTemplate);
				//				actionCol.find("button").on("click", onInvoiceDownload);
				var actionTdEl = $("<td>").addClass("text-center").html(actionColTemplate);

				tr.append(createTdElement(bookingModalId).html(item.Rate.Route.From))
					.append(createTdElement(bookingModalId).html(item.Rate.Route.To))
					.append(createTdElement(bookingModalId).html(item.PaxCount))
					.append(createTdElement(bookingModalId).html(item.TotalCost))
					.append(createTdElement(bookingModalId).html(moment(item.DepartDateTime).format("DD/MM/YYYY")))
					.append(createTdElement(bookingModalId).html(moment(item.ReturnDateTime).format("DD/MM/YYYY")))
					.append(createTdElement(bookingModalId).html(item.Status))
					.append(actionTdEl);

				actionTdEl.find("button").first().on("click", onInvoiceDownload);

				tbodyEl.append(tr);
			});
		},
		function () {
			hideSpinner("bookings");

			bookingTableEl.removeClass("hide");
			bookingTableEl.DataTable();
		}
	);
}

function bookingModalOnShow(event) {
	var modal = $(this);
	var tr = $(event.relatedTarget).parent();
	var data = { id: tr.data("id") };

	doAjaxPost("ManageBookings.aspx/GetBookingInfo",
		data,
		function (data) {
			var item = data.Item;

			modal.find("#view-booking-title").text("View Booking");
			modal.find("#view-booking-from").val(item.Rate.Route.From);
			modal.find("#view-booking-to").val(item.Rate.Route.To);
			modal.find("#view-booking-pax").val(item.PaxCount);
			modal.find("#view-booking-cost").val(item.TotalCost);
			modal.find("#view-booking-depart").val(moment(item.DepartDateTime).format("DD/MM/YYYY"))
			modal.find("#view-booking-return").val(moment(item.ReturnDateTime).format("DD/MM/YYYY"));

		},
		function () {
		}
	);
}

function onInvoiceDownload() {
	var btn = $(this);
	var tr = btn.parent().parent();
	var td = btn.parent();
	var id = tr.data("id");
	var data = { id: id };

	doAjaxPost("ManageBookings.aspx/GenerateInvoicePdf",
		data,
		function (data) {
			if (td.children().length === 3) return;

			var dlBtn = $("<button type='button' class='btn text-primary p-1' data-tooltip='tooltip' title='download invoice'>");
			var link = $("<a>").addClass("btn text-primary p-0").attr({ target: "_blank", href: data.Data.Path });
			link.html("<i class='fas fa-file-pdf'></i>");
			//			link.attr("href", data.Data.Path);
			//			link.attr("target", "_blank");
			//			link.html(data.Data.Name);
			dlBtn.append(link);
			td.append(dlBtn);
		},
		function () {
		}
	);
}