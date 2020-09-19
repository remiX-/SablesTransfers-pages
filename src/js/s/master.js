// Site.Master js
$(function () {

});

function showSpinner(id) {
	$("#spinner-" + id).removeClass("hide");
}

function hideSpinner(id) {
	$("#spinner-" + id).addClass("hide");
}

function doAjaxPost(url, data, onSuccess, onComplete) {
	$.ajax({
		url: url,
		type: "POST",
		data: JSON.stringify(data),
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		beforeSend: function () {
			console.log("ajax >> " + url);
			console.log("  > url: " + url);
			console.log("  > data: " + JSON.stringify(data));
		},
		success: function (response) {
			console.log("    > ajax >> success");
			console.log("      > response: " + JSON.stringify(response));

			onSuccess(response.d);

			console.log("    > ajax >> success.end");
		},
		complete: function () {
			onComplete();

			console.log("ajax >> complete");
		},
		failure: function (jqXHR, textStatus, errorThrown) {
			alert("HTTP Status: " + jqXHR.status + "; Error Text: " + jqXHR.responseText);
		}
	});
}

function createTdElement(modalId) {
	return $("<td>")
		.attr("data-toggle", "modal")
		.attr("data-target", "#" + modalId);
}