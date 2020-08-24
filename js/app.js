$(function () {
  var objJson;
  fetchAirports();
});

function fetchAirports() {
  var url = "./data/airports.json";
  $.ajax({
    url: url,
    type: "get",
    success: function (data) {
      //console.log(data);
      showData(data);
    },
  });
}

function showData(data) {
  response = data;
  var trHTML = "";
  $.each(response, function (i, airport) {
    trHTML +=
      "<tr id='row" +
      i +
      "' class='trow d-none'><td>" +
      airport.name +
      "</td><td>" +
      airport.icao +
      "</td><td>" +
      airport.iata +
      "</td><td>" +
      airport.elevation +
      "</td><td>" +
      airport.latitude +
      "</td><td>" +
      airport.longitude +
      "</td><td>" +
      airport.type +
      "</td></tr>";
  });
  $("#airportsTable").append(trHTML);
  changePage(1);
}

var current_page = 1;
var records_per_page = 4;

function prevPage() {
  if (current_page > 1) {
    current_page--;
    changePage(current_page);
  }
}

function nextPage() {
  if (current_page < numPages()) {
    current_page++;
    changePage(current_page);
  }
}

function numPages() {
  return Math.ceil(response.length / records_per_page);
}

function changePage(page) {
  var btn_next = document.getElementById("btn_next");
  var btn_prev = document.getElementById("btn_prev");
  var page_span = document.getElementById("page");
  var current;

  // Validate page
  if (page < 1) {
    page = 1;
  }
  if (page > numPages()) {
    page = numPages();
  }
  $(".trow").addClass("d-none").removeClass("d-show");
  for (
    var i = (page - 1) * records_per_page;
    i < page * records_per_page && i < response.length;
    i++
  ) {
    current = (page - 1) * records_per_page + 1;
    $("#row" + i)
      .addClass("d-show")
      .removeClass("d-none");
  }

  page_span.innerHTML =
    "Showing " + current + "-" + i + " Of " + response.length + " Results";

  if (page == 1) {
    btn_prev.style.visibility = "hidden";
  } else {
    btn_prev.style.visibility = "visible";
  }

  if (page == numPages()) {
    btn_next.style.visibility = "hidden";
  } else {
    btn_next.style.visibility = "visible";
  }
}

function search() {
  var input, filter, table, tr, td, cell, i, j;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  if (filter != "") {
    table = document.getElementById("airportsTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
      // Hide the row initially.
      tr[i].classList.remove("d-show");
      tr[i].classList.add("d-none");

      td = tr[i].getElementsByTagName("td");
      for (var j = 0; j < td.length; j++) {
        cell = tr[i].getElementsByTagName("td")[j];
        if (cell) {
          if (cell.innerHTML.toUpperCase().indexOf(filter) > -1) {
            tr[i].classList.remove("d-none");
            tr[i].classList.add("d-show");
            break;
          }
        }
      }
    }
  } else {
    fetchAirports();
  }
}

function filter(obj) {
  var id = $(obj).attr("id");
  var name = $(obj).attr("name");
  var value = parseInt($(obj).attr("value"));
  var IsChecked = $(obj).is(":checked");

  $('input[id*="chk_' + name + '"]').each(function () {
    var name_arr = [];
    if (parseInt($(this).val()) != 0) {
      if (IsChecked == true) {
        $(this).attr("checked", "checked");
        name_arr.push(name.toUpperCase());
        console.log(name_arr);
        filter_data(name_arr);
      } else {
        $(this).removeAttr("checked");
        var index = name_arr.indexOf(name);
        name_arr.splice(index, 1);
        filter_data(name_arr);
      }
    }
  });
}

function filter_data(name_arr) {
  var table = document.getElementById("airportsTable");
  var tr = table.getElementsByTagName("tr");
  for (i = 1; i < tr.length; i++) {
    // Hide the row initially.
    tr[i].classList.remove("d-show");
    tr[i].classList.add("d-none");
    td = tr[i].getElementsByTagName("td");
    cell = tr[i].getElementsByTagName("td")[6];
    if (cell) {
      document.getElementById("nav").classList.add("d-none");
      for (var k = 0; k < name_arr.length; k++) {
        if (cell.innerHTML.toUpperCase().indexOf(name_arr[k]) > -1) {
          tr[i].classList.remove("d-none");
          tr[i].classList.add("d-show");
          break;
        } else {
          document.getElementById("nav").classList.add("d-show");
          document.getElementById("nav").classList.remove("d-none");
          fetchAirports();
        }
      }
    }
  }
}
