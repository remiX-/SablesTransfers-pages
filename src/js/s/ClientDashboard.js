// Admin/Dashboard.aspx

// Vars
var userTableEl;

// On Document Ready
$(function () {
	userTableEl = $("#user-data");

	userUserData();
});

function userUserData() {
	doAjaxPost("ClientDashboard.aspx/GetAllUsers",
		{},
		function (data) {
			var tbodyEl = userTableEl.find("tbody");

			$.each(data.Items, function (index, item) {
				console.log(item + ' -> ' + index);

				var tr = $("<tr>")
					.attr("data-id", item.Id)
					.attr("data-toggle", "modal")
					.attr("data-target", "#rate-group-data-modal");

				tr.append($("<td>").html(item.FullName))
					.append($("<td>").html(item.Email))
					.append($("<td>").html(moment(item.DateCreated).format("DD/MM/YYYY")))
					.append($("<td>").html(item.UserTypeString));

				tbodyEl.append(tr);
			});
		},
		function () {
			hideSpinner("user-data");

			userTableEl.removeClass("hide");
			userTableEl.DataTable();
		}
	);
}