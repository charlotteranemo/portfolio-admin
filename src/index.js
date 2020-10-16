"use strict";

import './styles/main.scss';
import _ from 'lodash';

if (document.querySelector('input[name="choice"]')) {
    document.querySelectorAll('input[name="choice"]').forEach((radioBtn) => {
      radioBtn.addEventListener("change", whichForm);
    });
}

const username = document.getElementById("user");
const password = document.getElementById("pass");

//Hardcoded user details for a login function
window.login = function() {
    if (username.value === "frukt" && password.value === "sallad") {
        alert("You have successfully logged in.");
        localStorage.setItem("loggedin", "logged");
        location.reload();
    } else {
        alert("Wrong username or password!");
    }
}

const btnForm = document.getElementById("btnForm");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

//Decides what to display depending on if the user is logged in or not
window.onload = function() {
    let loginVar = localStorage.getItem("loggedin");

    if(loginVar == "logged") {
        btnForm.style.display = "block";
        loginForm.style.display = "none";
        logoutBtn.style.display = "block";
    } else {
        btnForm.style.display = "none";
        loginForm.style.display = "block";
        logoutBtn.style.display = "none";
    }
}

//Logs out the user
window.logout = function() {
    localStorage.setItem("loggedin", "loggedOut");
    location.reload();
}

const courseBtn = document.getElementById("course");
const courseForm = document.getElementById("courseForm");
const workBtn = document.getElementById("work");
const workForm = document.getElementById("workForm");
const websiteBtn = document.getElementById("website");
const websiteForm = document.getElementById("websiteForm");
const list = document.getElementById("list");
const courseName = document.getElementById("courseName");
const courseStart = document.getElementById("courseStart");
const courseEnd = document.getElementById("courseEnd");
const schoolEl = document.getElementById("school");
const updateBtn = document.getElementById("updateBtn");
const workName = document.getElementById("workName");
const workStart = document.getElementById("workStart");
const workEnd = document.getElementById("workEnd");
const titleEl = document.getElementById("title");
const webName = document.getElementById("webName");
const url = document.getElementById("url");
const description = document.getElementById("description");
const img = document.getElementById("img");

//Checks which form to show
function whichForm() {
    if(courseBtn.checked) {
        courseForm.style.display = "block";
        workForm.style.display = "none";
        websiteForm.style.display = "none";
        loadCourses();
    } else if(workBtn.checked) {
        courseForm.style.display = "none";
        workForm.style.display = "block";
        websiteForm.style.display = "none";
        loadWork();
    } else if(websiteBtn.checked) {
        courseForm.style.display = "none";
        websiteForm.style.display = "block";
        workForm.style.display = "none";
        loadWebsites();
    }
}

function loadCourses() {
    //Empties the list
    list.innerHTML = "";
    
    //Empties the input-fields
    courseName.value = "";
    courseStart.value = "";
    courseEnd.value = "";
    schoolEl.value = "";

    //Prints all added courses to the screen
    fetch('http://charlotteranemo.se/pRest/courses')
    .then(response => response.json())
    .then(data => 
        data.forEach(course =>
            list.innerHTML += `<tr><td>${course.name}</td><td>${course.start}</td><td>${course.end}</td><td>${course.school}</td><td><button class="smallBtn" onclick="deleteCourse(${course.id})">Radera</button></td><td><button class="smallBtn" onclick="updateCourse('${course.id}', '${course.name}', '${course.start}', '${course.end}', '${course.school}')">Uppdatera</button></td></tr>`));
}

function loadWork() {
    //Empties the list
    list.innerHTML = "";
    
    //Empties the input-fields
    workName.value = "";
    workStart.value = "";
    workEnd.value = "";
    titleEl.value = "";

    //Prints all added workplaces to the screen
    fetch('http://charlotteranemo.se/pRest/work')
    .then(response => response.json())
    .then(data => 
        data.forEach(work =>
            list.innerHTML += `<tr><td>${work.name}</td><td>${work.start}</td><td>${work.end}</td><td>${work.title}</td><td><button class="smallBtn" onclick="deleteWork(${work.id})">Radera</button></td><td><button class="smallBtn" onclick="updateWork('${work.id}', '${work.name}', '${work.start}', '${work.end}', '${work.title}')">Uppdatera</button></td></tr>`));
}

function loadWebsites() {
    //Empties the list
    list.innerHTML = "";
    
    //Empties the input-fields
    webName.value = "";
    url.value = "";
    description.value = "";
    img.value = "";

    //Prints all added workplaces to the screen
    fetch('http://charlotteranemo.se/pRest/websites')
    .then(response => response.json())
    .then(data => 
        data.forEach(web =>
            list.innerHTML += `<tr><td>${web.name}</td><td><a href="${web.url}">URL-Link</a></td><td>${web.description}</td><td><a href="${web.img}">IMG-Link</a></td><td><button class="smallBtn" onclick="deleteWebsite(${web.id})">Radera</button></td><td><button class="smallBtn" onclick="updateWebsite('${web.id}', '${web.name}', '${web.url}', '${web.description}', '${web.img}')">Uppdatera</button></td></tr>`));
}

//Puts in old data for easier update
window.updateCourse = function(id, name, start, end, school) {

    courseName.value = name;
    courseStart.value = start;
    courseEnd.value = end;
    schoolEl.value = school;

    updateBtn.innerHTML = `<button onclick="postUpdate(${id})">Uppdatera</button>`
}

//And same for work, and then websites
window.updateWork = function(id, name, start, end, title) {

    workName.value = name;
    workStart.value = start;
    workEnd.value = end;
    titleEl.value = title;

    updateBtn.innerHTML = `<button onclick="postUpdate(${id})">Uppdatera</button>`
}

window.updateWebsite = function(id, name, webUrl, webDescription, webImg) {

    webName.value = name;
    url.value = webUrl;
    description.value = webDescription;
    img.value = webImg;

    updateBtn.innerHTML = `<button onclick="postUpdate(${id})">Uppdatera</button>`
}

window.postUpdate = function(id) {

    //Checks which category is chosen, and then updates the right post
    if(courseBtn.checked) {
        let name = courseName.value;
        let start = courseStart.value;
        let end = courseEnd.value;
        let school = schoolEl.value;
    
        let course = {'courseName' : name, 'courseStart' : start, 'courseEnd' : end, 'school' : school};
    
        fetch('http://charlotteranemo.se/pRest/courses?id=' + id,
        {method: 'PUT', body: JSON.stringify(course)})
        .then(response => response.json())
        .then(data => loadCourses());
    } else if(workBtn.checked) {
        let name = workName.value;
        let start = workStart.value;
        let end = workEnd.value;
        let title = titleEl.value;

        let work = {'workName' : name, 'workStart' : start, 'workEnd' : end, 'title' : title};

        fetch('http://charlotteranemo.se/pRest/work?id=' + id,
        {method: 'PUT', body: JSON.stringify(work)})
        .then(response => response.json())
        .then(data => loadWork());

    } else if(websiteBtn.checked) {
        let name = webName.value;
        let webUrl = url.value;
        let webDesc = description.value;
        let webImg = img.value;

        let web = {'webName' : name, 'url' : webUrl, 'description' : webDesc, 'img' : webImg};

        fetch('http://charlotteranemo.se/pRest/websites?id=' + id,
        {method: 'PUT', body: JSON.stringify(web)})
        .then(response => response.json())
        .then(data => loadWebsites());
    }
    
}

//Deletes the course with id=id
window.deleteCourse = function(id) {
    fetch('http://charlotteranemo.se/pRest/courses?id=' + id,
    {method: 'DELETE'})
    .then(response => response.json())
    .then(data => loadCourses());
}

window.deleteWork = function(id) {
    fetch('http://charlotteranemo.se/pRest/work?id=' + id,
    {method: 'DELETE'})
    .then(response => response.json())
    .then(data => loadWork());
}

window.deleteWebsite = function(id) {
    fetch('http://charlotteranemo.se/pRest/websites?id=' + id,
    {method: 'DELETE'})
    .then(response => response.json())
    .then(data => loadWebsites());
}

//Adds a course
window.addCourse = function() {

    let name = courseName.value;
    let start = courseStart.value;
    let end = courseEnd.value;
    let school = schoolEl.value;

    let course = {'courseName' : name, 'courseStart' : start, 'courseEnd' : end, 'school' : school};

    fetch('http://charlotteranemo.se/pRest/courses',
    {method: 'POST', body: JSON.stringify(course)})
    .then(response => response.json())
    .then(data => loadCourses());
}

//Adds a workplace
window.addWork = function() {

    let name = workName.value;
    let start = workStart.value;
    let end = workEnd.value;
    let title = titleEl.value;

    let work = {'workName' : name, 'workStart' : start, 'workEnd' : end, 'title' : title};

    fetch('http://charlotteranemo.se/pRest/work',
    {method: 'POST', body: JSON.stringify(work)})
    .then(response => response.json())
    .then(data => loadWork());
}

//Adds a website
window.addWebsite = function() {

    let name = webName.value;
    let webUrl = url.value;
    let webDesc = description.value;
    let webImg = img.value;

    let web = {'webName' : name, 'url' : webUrl, 'description' : webDesc, 'img' : webImg};

    fetch('http://charlotteranemo.se/pRest/websites',
    {method: 'POST', body: JSON.stringify(web)})
    .then(response => response.json())
    .then(data => loadWebsites());
}