<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html>
<html>
	<head>
	    <meta charset="UTF-8">
	    <title>Dopamine</title>
	    <link rel="stylesheet" href="/resources/css/mainStyle.css">
	    <link rel="stylesheet" href="/resources/css/chooseCharacter.css">
	    <script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
	</head>
	<body>
	    <div id="characterSelectScreen">
	        <h2>캐릭터 선택</h2>
	        <p>당신의 캐릭터를 선택하세요</p>
	        <div class="characterGrid" id="characterGrid">
	    <c:forEach var="ch" items="${characterList}" varStatus="status">
	        <div class="character-container">
	            <div class="characterOption" 
	                 data-name="${ch.name}" 
	                 data-birthday="${ch.birthday}"
	                 data-description="${ch.description}"
	                 data-alias="${ch.alias}"
					 data-picture= "${ch.picture}"
	                 data-authority="${ch.authority }"
	                 data-index="${status.index}">
	                <img class="characterImg" alt="${ch.name}" src="/resources/images/character/${ch.picture}" />
	                <div class="characterName">${ch.name}</div>
	            </div>
	        </div>
	        
	        <!-- 각 캐릭터 뒤에 정보창 (기본적으로 숨김) -->
	        <div class="character-info-slide" data-character="${status.index}">
	            <div class="info-content">
	                <div class="info-item">
	                    <span class="label">이름:</span>
	                    <span class="value">${ch.name }</span>
	                </div>
	                <div class="info-item">
	                    <span class="label">별명:</span>
	                    <span class="value">${ch.alias }</span>
	                </div>
	                <div class="info-item">
	                    <span class="label">생년월일:</span>
	                    <span class="value">${ch.birthday }</span>
	                </div>
	                <div class="info-item">
	                    <span class="label">설명:</span>
	                    <span class="value description-value">${ch.description }</span>
	                </div>
	            </div>
	        </div>
	    </c:forEach>
	    </div>
	        <button id="confirmCharacter">캐릭터 확정</button>
	    </div>
	    
	    <!-- 모달 -->
		<div class="modal-overlay" id="modal">
		    <div class="modal-content">
		        <div class="modal-title" id="modalTitle"></div>
		        <div class="modal-message" id="modalMessage"></div>
		        <button class="modal-button" id="modalClose">확인</button>
		    </div>
		</div>
	    
	    <script src="/resources/js/Character.js"></script>
	</body>
</html>
