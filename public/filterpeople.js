function filterPeopleBySchool() {
    console.log("Hello from filterPeopleBySchool()!");
    //get the id of the selected house from the filter dropdown
    var school_id = document.getElementById('school_filter').value
    //construct the URL and redirect to it
    window.location = '/characters/filter/' + parseInt(school_id)
};