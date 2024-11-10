
 $(document).ready(function() {

    let table = $('#myTable').DataTable({
        responsive: true,
        searching: true,
        pageLength:25,
        lengthChange:false,
        paging:false,
        info:false,
        order: [[0, 'asc']] // prvi stupac ascending 
        });

});

function myFunction(){
    document.getElementById("mojDropdown").classList.toggle("show");
}

//zatvaranje dropdowna
window.onclick = function(event){
    if(!event.target.matches("dropbutton")){
        var dropdowns = document.getElementsByClassName("dropcontent");
        var i;
        for(i=0;i<dropdowns.length;i++){
            var openDropdown=dropdowns[i];
            if(openDropdown.classList.contains("show")){
                openDropdown.classList.remove("show")
            }
        }
    }
}

$(document).ready(function() {
    const table = $('#myTable').DataTable();

    
    $('#searchInput').on('keyup', function() {
        const searchValue = this.value;
        const filterType = $('#filterType').val();

        
        if (filterType === "hotel") {
            table.columns(0).search(searchValue).draw(); // trazi po hotelima
            table.columns(4).search(''); // ocisti filter za grad
        } else if (filterType === "grad") {
            table.columns(4).search(searchValue).draw(); 
            table.columns(0).search(''); 
        } else {
            table.search(searchValue).draw();
        }
    });

    
    $('#filterType').on('change', function() {
        $('#searchInput').val(''); // ocisti tekst
        table.search('').columns().search('').draw(); // resetiram za sve stupce
    });
});




