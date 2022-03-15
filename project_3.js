//////////////////////////////////////변수 선언 및 정의//////////////////////////

//입력 옵션 배열 선언 및 정의
var locs = new Array("강남구","강동구","강북구","강서구",
"관악구","광진구","구로구","금천구","노원구","도봉구","동대문구",
"동작구","마포구","서대문구","서초구","성동구","성북구","송파구",
"양천구","영등포구","용산구","은평구","종로구","중구","중랑구");

//공원 갯수 변수
var count;

//초기 화면 서울시 중심 좌표
var Seoul =  {
	latitude: 37.5642135,
	longitude: 127.0016985
};

//지도 전역 변수
var map;

////////////////////////////////////////메인////////////////////////////////

window.onload = function () {
    //초기 서울시 지도 출력
    showMap(Seoul);

    //입력 옵션 함수
    updatelocation(locs);

    var searchButton = document.getElementById("search");
    searchButton.onclick = buttonHandler;
}

// 버튼 클릭 시 호출
function buttonHandler(){
    //서울시 공원 API호출
    var url1 = "http://openAPI.seoul.go.kr:8088/70767359647a786334324d4162774e/json/SearchParkInfoService/1/133/";
    $.getJSON(url1, updateData);

    //서울시 구 중심 좌표 API호출
    var url2 = "http://openapi.seoul.go.kr:8088/765771424f7a78633738596e6a444f/json/SdeTlSccoSigW/1/26/";
    $.getJSON(url2, updateMap);
}

//서울시 공원 API 호출시 실행 : 공원 데이터 업데이트, 마커 생성
function updateData(str) {
    count = 1; //공원 

    //기존 데이터 삭제
    $("#data").empty();

    //선택된 지역 가져오기
    var location = document.getElementById("location");
    var index = location.selectedIndex;
    var selectLocation = location[index].value;

    //API 데이터 추출
    var data = str.SearchParkInfoService.row;

    //html data div 가져오기
    var dataDiv = document.getElementById("data");
    for (var i = 0; i < data.length; i++) {

        //선택된 지역과 공원의 지역이 같을 경우
        if(selectLocation == data[i].P_ZONE){

            //새 div 생성
            var div = document.createElement("div");        

            //공원 데이터를 위한 새 div 생성
            var dataIndex = document.createElement("div");  
            var dataName = document.createElement("div");
            var dataNumber = document.createElement("div");
            var dataLocation = document.createElement("div");
            var dataAddress = document.createElement("div");
            var dataContent = document.createElement("div");

            //공원 데이터 입력
            dataIndex.innerHTML = "<h3>NO." + String(count) + "</h3>";
            dataName.innerHTML = "공원명 : " + data[i].P_PARK;
            dataNumber.innerHTML = "전화번호 : "+data[i].P_ADMINTEL;
            dataLocation.innerHTML = "지역 : " + data[i].P_ZONE;
            dataAddress.innerHTML = "주소 : " + data[i].P_ADDR;
            dataContent.innerHTML = "공원개요" + data[i].P_LIST_CONTENT;

            //div에 추가
            div.appendChild(dataIndex);
            div.appendChild(dataName);
            div.appendChild(dataNumber);
            div.appendChild(dataLocation);
            div.appendChild(dataAddress);
            div.appendChild(dataContent);

            //data div에 추가
            dataDiv.appendChild(div);
        
            //마커 생성
            var googleLatAndLong = new google.maps.LatLng(data[i].LATITUDE, data[i].LONGITUDE);
            var parkName = count + ". " + data[i].P_PARK;
            addMarker(map, googleLatAndLong, parkName);

            count = count + 1 ;
        }
    }
} 

//입력 옵션 함수
function updatelocation(locs) {
	var locationSelection = document.getElementById("location");
	for (var i = 0; i < locs.length; i++) {
		loc = locs[i];
		var option = document.createElement("option");
		option.text = loc;
		locationSelection.options.add(option);
    }
	locationSelection.selectedIndex = 0;
}

//좌표 API 호출시 실행, 구 좌표로 지도 생성
function updateMap(str){
    var div = document.getElementById("map")

    //API 데이터 추출
    var data = str.SdeTlSccoSigW.row;

    //선택된 지역 가져오기
    var location = document.getElementById("location");
    var index = location.selectedIndex;
    var selectLocation = location[index].value;

    for (var i = 0; i < data.length; i++) {
        //선택된 지역과  좌표의 지역이 같을 경우
        if(selectLocation == data[i].SIG_KOR_NM){
            var locLAT = data[i].LAT;
            var locLNG = data[i].LNG;
            showLocation(locLAT, locLNG);
        }
    }
    
}

//초기 서울 지도 표시 함수
function showMap(coords) {
	var googleLatAndLong = new google.maps.LatLng(coords.latitude, 
												  coords.longitude);
	var mapOptions = {
		zoom: 10,
		center: googleLatAndLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);
}

//구 좌표로 지도 생성 함수
function showLocation(lat, lng) {
	var googleLatAndLong = new google.maps.LatLng(lat, lng);
	var mapOptions = {
		zoom: 12,
		center: googleLatAndLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById("map");
    map = new google.maps.Map(mapDiv, mapOptions);
}

//마커 생성 함수
function addMarker(map, latlng, title){
    var markerOption = {
        position : latlng,
        map : map,
        title : title,
        clickable : true
    };

    var marker = new google.maps.Marker(markerOption);

    var infoWindowOption={
        content: title,
        position: latlng
    };

    var infoWindow = new google.maps.InfoWindow(infoWindowOption);

    google.maps.event.addListener(marker, "click", function(){
        infoWindow.open(map);
    });
}