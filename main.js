const taskbar = document.getElementById("taskbar");
const window_position_map = new Map();
const window_open_map = new Map();
let current_window_z = 2;
let current_button = null;

windows = document.getElementsByClassName("window")

for (let i = 0; i < windows.length; i++) {
    window_position_map.set(windows[i].id, {top: document.documentElement.clientHeight * 0.125, left: document.documentElement.clientWidth * 0.125, bottom: document.documentElement.clientHeight * 0.875, right: document.documentElement.clientWidth * 0.875})
    window_open_map.set(windows[i].id, false);
    windows[i].style.zIndex = current_window_z;
    current_window_z++;
    makeDraggable(windows[i]);
}

let current_active_window = windows[windows.length-1];

function icon_onclick(icon) {
    icon.children[1].style.display = "block";
    icon.children[2].style.backgroundColor = "#000080";
    icon.children[2].style.outlineStyle = "dotted";
}

function folder_icon_onclick(icon) {
    icon.children[1].style.display = "block";
    icon.children[2].style.backgroundColor = "none";

    icon.children[2].style.outlineStyle = "dotted";
}

var intervalRewind;
function playVideo(video){
    video.play();
    clearInterval(intervalRewind);
}
function pauseVideo(video){
    video.pause();
    clearInterval(intervalRewind);
}
function stopVideo(video){
    video.pause();
    video.currentTime = 0;
    clearInterval(intervalRewind);
}

function beginVideo(video){
    video.currentTime = 0;
    clearInterval(intervalRewind);
}
function reverseVideo(video){
    intervalRewind = setInterval(function(){
        video.playbackRate = 1.0;
        if(video.currentTime == 0){
            clearInterval(intervalRewind);
            video.pause();
        }
        else{
            video.currentTime += -.1;
        }
    } , 30);
}
function forwardVideo(video){
    video.playbackRate = 1;
    clearInterval(intervalRewind);
}
function endVideo(video){
    video.currentTime = video.duration;
    clearInterval(intervalRewind);
}


function open_window(prefix){
    if (!window_open_map.get(prefix+"Window")){
        window_open_map.set(prefix+"Window", true);
        target_window = document.getElementById(prefix+"Window");
        target_window.style.display = "flex";
        construct_taskbar_button(prefix+"Button", prefix, prefix+"Window", "assets/textures/opti/document-2.png")
        makeWindowActive(target_window)
    }
}

function open_email(){
    var email = "sujitsaravanan15@gmail.com";
            var subject = "Contact from portfolio";
            document.location = "mailto:"+email+"?subject="+subject+"&body=";
}

function construct_taskbar_button(button_id, button_name, window_id, texture_filepath){
    let new_button = document.createElement("div");
    new_button.classList.add("taskbar-button");
    new_button.id = button_id;

    new_button.innerHTML = '<div class="taskbar-button-content"><img class="icon_image" src=' + texture_filepath + ' alt="$$icon_name" draggable="false">' + button_name + '</div>'


    new_button.setAttribute( "onClick", "makeWindowActive(document.getElementById(\"" + window_id + "\"))" );
    taskbar.appendChild(new_button);
}

function clear_selected_icons() {
    window.onclick = e => {
        let effects = document.getElementsByClassName("selection-effect");
        for (let i = 0; i < effects.length; i++)
            if (e.target.parentNode != effects[i].parentNode) {
                effects[i].style.display = null;
                effects[i].nextElementSibling.style.backgroundColor = null;
                effects[i].nextElementSibling.style.outlineStyle = null;
            }
        if (e.target.className == "icon_container")
            icon_onclick(e.target)
        else if (e.target.parentNode.className == "icon_container")
            icon_onclick(e.target.parentNode)
        if (e.target.className == "folder_icon_container")
            folder_icon_onclick(e.target)
        else if (e.target.parentNode.className == "folder_icon_container")
            folder_icon_onclick(e.target.parentNode)
    }
}


function makeWindowActive(window) {
    button = getWindowTaskbarButton(window)
    window.style.display = "flex";

    if (current_button == null)
        current_button = button;

    current_button.classList.remove("window-clicked");
    current_button = button;
    current_button.classList.add("window-clicked");

    if (window != current_active_window){
        current_active_window.children[0].style.backgroundColor = "#808080";
        current_active_window.children[0].style.color = "#c0c0c0";
        current_window_z++;
        window.style.zIndex = current_window_z;
        current_active_window = window;
        current_active_window.children[0].style.backgroundColor = "rgb(0, 0, 128)";
        current_active_window.children[0].style.color = "white";
    }
}

function getWindowTaskbarButton(window){
    return document.getElementById(window.id.slice(0, window.id.length - 6) + "Button")
}

function makeDraggable(elmnt) {
    let tops = window_position_map.get(elmnt.id).top;
    let bots = window_position_map.get(elmnt.id).bottom;
    let rights = window_position_map.get(elmnt.id).right;
    let lefts = window_position_map.get(elmnt.id).left;

    let currentPosX = 0, currentPosY = 0, previousPosX = 0, previousPosY = 0;

    // If there is a window-top classed element, attach to that element instead of full window
    elmnt.querySelector('.window_title_bar_draggable').onmousedown = dragMouseDown;
    elmnt.querySelector('.window_content').onmousedown = setActive;
    elmnt.onmousemove = detectResize;

    function updatePos(){
        tops = window_position_map.get(elmnt.id).top;
        bots = window_position_map.get(elmnt.id).bottom;
        rights = window_position_map.get(elmnt.id).right;
        lefts = window_position_map.get(elmnt.id).left;
    }

    function detectResize(e) {
        e.preventDefault();
        let select_radius = 10
        let new_cursor = "";

        if (e.clientY - elmnt.offsetTop > elmnt.offsetHeight - select_radius) {
            new_cursor += 's';
        }
        else if (e.clientY - elmnt.offsetTop < select_radius) {
            new_cursor += 'n';
        }

        if (e.clientX - elmnt.offsetLeft > elmnt.offsetWidth - select_radius) {
            new_cursor += 'e';
        }
        else if (e.clientX - elmnt.offsetLeft < select_radius) {
            new_cursor += 'w';
        }

        if (new_cursor == "") {
            new_cursor = "default";
            elmnt.onmousedown = null;
        } else {

            new_cursor += "-resize";
        }

        elmnt.style.cursor = new_cursor;
        
        switch (new_cursor) {
            case "s-resize":
                elmnt.onmousedown = resizeMouseDownSouth;
                break;
            case "n-resize":
                elmnt.onmousedown = resizeMouseDownNorth;
                break;
            case "e-resize":
                elmnt.onmousedown = resizeMouseDownEast;
                break;
            case "w-resize":
                elmnt.onmousedown = resizeMouseDownWest;
                break;

            case "se-resize":
                elmnt.onmousedown = resizeMouseDownSouthEast;
                break;
            case "ne-resize":
                elmnt.onmousedown = resizeMouseDownNorthEast;
                break;
            case "sw-resize":
                elmnt.onmousedown = resizeMouseDownSouthWest;
                break;
            case "nw-resize":
                elmnt.onmousedown = resizeMouseDownNorthWest;
                break;
        }
    }

    
    function resizeMouseDownSouthEast(e){
        e.preventDefault();
        setActive();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementResizeSouthEast;
    }
    function resizeMouseDownNorthEast(e){
        e.preventDefault();
        setActive();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementResizeNorthEast;
    }
    function resizeMouseDownSouthWest(e){
        e.preventDefault();
        setActive();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementResizeSouthWest;
    }
    function resizeMouseDownNorthWest(e){
        e.preventDefault();
        setActive();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementResizeNorthWest;
    }

    function resizeMouseDownNorth(e){
        e.preventDefault();
        setActive();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementResizeNorth;
    }
    function resizeMouseDownSouth(e){
        e.preventDefault();
        setActive();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementResizeSouth;
    }
    function resizeMouseDownEast(e){
        e.preventDefault();
        setActive();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementResizeEast;
    }
    function resizeMouseDownWest(e){
        e.preventDefault();
        setActive();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementResizeWest;
    }


    let min_width = 400;
    let min_height = 400;
    function elementResizeSouthEast(e){
        e.preventDefault();
        updatePos()

        prev_rights = rights;
        prev_bots = bots;
        bots = e.clientY;
        rights = e.clientX;
        
        if (bots - tops <= min_height)
            bots = prev_bots;
        if (rights - lefts <= min_width)
            rights = prev_rights;
            
        window_position_map.set(elmnt.id, {top: tops, left: lefts, bottom: bots, right: rights})
        elmnt.style.height = bots - tops + "px";
        elmnt.style.width = rights - lefts + "px";
    }
    function elementResizeNorthEast(e){
        e.preventDefault();
        updatePos()

        prev_rights = rights;
        prev_tops = tops;
        tops = e.clientY;
        rights = e.clientX;
        
        if (bots - tops <= min_height)
            tops = prev_tops;
        if (rights - lefts <= min_width)
            rights = prev_rights;
            
        window_position_map.set(elmnt.id, {top: tops, left: lefts, bottom: bots, right: rights})
        elmnt.style.top = tops + "px";
        elmnt.style.height = bots - tops + "px";
        elmnt.style.width = rights - lefts + "px";
    }
    function elementResizeSouthWest(e){
        e.preventDefault();
        updatePos()

        prev_lefts = lefts;
        prev_bots = bots;
        bots = e.clientY;
        lefts = e.clientX;
        
        if (bots - tops <= min_height)
            bots = prev_bots;
        if (rights - lefts <= min_width)
            lefts = prev_lefts;
            
        window_position_map.set(elmnt.id, {top: tops, left: lefts, bottom: bots, right: rights})
        elmnt.style.left = lefts + "px";
        elmnt.style.height = bots - tops + "px";
        elmnt.style.width = rights - lefts + "px";
    }
    function elementResizeNorthWest(e){
        e.preventDefault();
        updatePos()

        prev_lefts = lefts;
        prev_tops = tops;
        tops = e.clientY;
        lefts = e.clientX;
        
        if (bots - tops <= min_height)
            tops = prev_tops;
        if (rights - lefts <= min_width)
            lefts = prev_lefts;
            
        window_position_map.set(elmnt.id, {top: tops, left: lefts, bottom: bots, right: rights})
        elmnt.style.top = tops + "px";
        elmnt.style.left = lefts + "px";
        elmnt.style.height = bots - tops + "px";
        elmnt.style.width = rights - lefts + "px";
    }

    function elementResizeNorth(e){
        e.preventDefault();
        // updatePos()

        prev_tops = tops;
        tops = e.clientY;
        
        if (bots - tops <= min_height)
            tops = prev_tops;

        window_position_map.set(elmnt.id, {top: tops, left: lefts, bottom: bots, right: rights})
        elmnt.style.top = tops + "px";
        elmnt.style.height = (bots - tops) + "px  ";
    }
    function elementResizeSouth(e){
        e.preventDefault();
        updatePos()

        prev_bots = bots;
        bots = e.clientY;

        if (bots - tops <= min_height)
            bots = prev_bots;

        window_position_map.set(elmnt.id, {top: tops, left: lefts, bottom: bots, right: rights})
        elmnt.style.height = bots - tops + "px  ";
    }
    function elementResizeEast(e){
        e.preventDefault();
        updatePos()

        prev_rights = rights
        rights = e.clientX;

        if (rights - lefts <= min_width)
            rights = prev_rights;

        window_position_map.set(elmnt.id, {top: tops, left: lefts, bottom: bots, right: rights})
        elmnt.style.width = rights - lefts + "px  ";
    }
    function elementResizeWest(e){
        e.preventDefault();
        updatePos()

        prev_lefts = lefts;
        lefts = e.clientX;

        if (rights - lefts  <= min_width)
            lefts = prev_lefts;

        window_position_map.set(elmnt.id, {top: tops, left: lefts, bottom: bots, right: rights})
        elmnt.style.left = lefts + "px";
        elmnt.style.width = rights - lefts + "px  ";
    }


    function setActive() {
        makeWindowActive(elmnt)
    }
    function dragMouseDown(e) {
        setActive();
        // Prevent any default action on this element (you can remove if you need this element to perform its default action)
        e.preventDefault();
        // Get the mouse cursor position and set the initial previous positions to begin
        previousPosX = e.clientX;
        previousPosY = e.clientY;
        // When the mouse is let go, call the closing event
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        // Prevent any default action on this element (you can remove if you need this element to perform its default action)
        e.preventDefault();
        // Calculate the new cursor position by using the previous x and y positions of the mouse
        currentPosX = previousPosX - e.clientX;
        currentPosY = previousPosY - e.clientY;
        // Replace the previous positions with the new x and y positions of the mouse
        previousPosX = e.clientX;
        previousPosY = e.clientY;
        // Set the element's new position

        tops = elmnt.offsetTop - currentPosY
        lefts = elmnt.offsetLeft - currentPosX
        bots = tops + elmnt.offsetHeight;
        rights = lefts + elmnt.offsetWidth;

        window_position_map.set(elmnt.id, {top: tops, left: lefts, bottom: bots, right: rights})
        elmnt.style.top = tops + 'px';
        elmnt.style.left = lefts + 'px';
    }

    function closeDragElement() {
        // Stop moving when mouse button is released and release events
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function close_window(prefix){
    document.getElementById(prefix+"Window").style.display = "none";
    window_open_map.set(prefix+"Window", false)
    taskbar.removeChild(document.getElementById(prefix+"Button"));
}
function minimize_window(button){
    const window = button.parentNode.parentNode.parentNode;

    makeWindowActive(window);
    button = getWindowTaskbarButton(window);
    button.classList.remove("window-clicked");
    current_button = null;

    window.style.display = "none";
}
function maximize_window(button){
    const window = button.parentNode.parentNode.parentNode;
    const maximized_positions = {top: 0, left: 0, bottom: document.documentElement.scrollHeight - taskbar.offsetHeight - 4, right: document.documentElement.scrollWidth - 4};
    const resized_positions = {top: document.documentElement.clientHeight * 0.125, left: document.documentElement.clientWidth * 0.125, bottom: document.documentElement.clientHeight * 0.875, right: document.documentElement.clientWidth * 0.875};
    if (window.style.top    != maximized_positions.top + "px"   || window.style.left   != maximized_positions.left + "px"  || window.style.width  != maximized_positions.right + "px" || window.style.height != maximized_positions.bottom + "px" ) {
        button.style.backgroundImage = "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='6' height='2' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23000' d='M0 0h6v2H0z'/%3E%3C/svg%3E\");"
        makeWindowActive(window);
        window_position_map.set(window.id, maximized_positions)
    
        window.style.top = maximized_positions.top + "px";
        window.style.left = maximized_positions.left + "px";
        window.style.width = maximized_positions.right + "px";
        window.style.height = maximized_positions.bottom + "px";
    } else {
        makeWindowActive(window);
        window_position_map.set(window.id, resized_positions)
    
        window.style.top = resized_positions.top + "px";
        window.style.left = resized_positions.left + "px";
        window.style.width = resized_positions.right - resized_positions.left + "px";
        window.style.height = resized_positions.bottom - resized_positions.top + "px";
    }
}
