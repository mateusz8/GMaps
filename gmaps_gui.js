var $locations = $('#locations');

function addLocation(id, name) {
	var elem = $('<div class="location" data-id='+id+'><div class="name">'+name+'</div><div class="close"></div></div>');
	elem.find('.close').on('click', removeLocation);
	$locations.append(elem);
}
function removeLocation() {
	var elem = $(this).closest('.location');
	var id = elem.data('id');
	//remove location from dataset
	elem.remove();
}
