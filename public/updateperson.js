function updatePerson(id){
	$.ajax({
		url: '/characters/' + id,
		type: 'PUT',
		data: $('#update-person').serialize(),
		success: function(result){
			window.location.replace("./");
		}
	})
};