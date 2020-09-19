// Admin/Dashboard.aspx

// Vars
var tableEl;
var tableTbodyEl;

// On Document Ready
$(function () {
	tableEl = $("#bookings-data");
	tableTbodyEl = tableEl.find("tbody");

	loadData();
});

function loadData() {
	doAjaxPost("BookingsDashboard.aspx/GetAllPendingBookings",
		{},
		function (data) {
			$.each(data.Items, function (index, item) {
				console.log(item + ' -> ' + index);

				var tr = $("<tr>")
					.attr("data-id", item.Id)
					.attr("data-toggle", "modal")
					.attr("data-target", "#rate-group-data-modal");

				tr.append($("<td>").html(item.User.FullName))
					.append($("<td>").html(item.Email))
					.append($("<td>").html(item.Rate.Route.From))
					.append($("<td>").html(item.Rate.Route.To))
					.append($("<td>").html(item.PaxCount))
					.append($("<td>").html(item.TotalCost))
					.append($("<td>").html(moment(item.DepartDateTime).format("DD/MM/YYYY")))
					.append($("<td>").html(moment(item.ReturnDateTime).format("DD/MM/YYYY")));

				tableTbodyEl.append(tr);
			});
		},
		function () {
			hideSpinner("bookings-data");

			tableEl.removeClass("hide");
			tableEl.DataTable();
		}
	);
}