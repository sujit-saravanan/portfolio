const taskbar = document.getElementById("taskbar");
const window_position_map = new Map();
let current_window_z = 2;
let current_button = null;

windows = document.getElementsByClassName("window")

for (let i = 0; i < windows.length; i++) {
    window_position_map.set(windows[i].id, {top: document.documentElement.clientHeight * 0.05, left: document.documentElement.clientWidth * 0.25, bottom: document.documentElement.clientHeight * 0.05 + 700, right: document.documentElement.clientWidth * 0.25 + 1000})
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
function folder_icon_ondbclick(icon) {
    switch (icon.children[2].innerText) {
        case "Resume":
            resume_window = document.getElementById("ResumeWindow");
            resume_window.style.display = "flex";
            makeWindowActive(resume_window)
            let resume_button = document.createElement("button");
            resume_button.id = "ResumeButton";
            resume_button.textContent = "Resume";
            taskbar.appendChild(resume_button);
            break;
        case "Projects":
            projects_window = document.getElementById("ProjectsWindow")
            projects_window.style.display = "flex";
            makeWindowActive(projects_window)
            let projects_button = document.createElement("button");
            projects_button.id = "ProjectsButton";
            projects_button.textContent = "Projects";
            taskbar.appendChild(projects_button);
            break;
        case "Contact Me":
            var email = "sujitsaravanan15@gmail.com";
            var subject = "Contact from portfolio";
            var emailBody = "message.from";
            document.location = "mailto:"+email+"?subject="+subject+"&body=";
            break;
        case "Help":
            help_window = document.getElementById("HelpWindow")
            help_window.style.display = "flex";
            makeWindowActive(help_window)
            let help_button = document.createElement("button");
            help_button.id = "HelpButton";
            help_button.textContent = "Help Me";
            taskbar.appendChild(help_button);
            break;
        default:
    }
}

function construct_taskbar_button(button_id, button_name, window_id, texture_filepath){
    let new_button = document.createElement("div");
    new_button.classList.add("taskbar-button");
    new_button.id = button_id;

    new_button.innerHTML = '<div class="taskbar-button-content"><img class="icon_image" src=' + texture_filepath + ' alt="$$icon_name" draggable="false">' + button_name + '</div>'


    new_button.setAttribute( "onClick", "makeWindowActive(document.getElementById(\"" + window_id + "\"))" );
    taskbar.appendChild(new_button);
}

function icon_ondbclick(icon) {
    switch (icon.children[2].innerText) {
        case "Resume":
            resume_window = document.getElementById("ResumeWindow");
            resume_window.style.display = "flex";
            construct_taskbar_button("ResumeButton", "Resume", "ResumeWindow", "assets/textures/opti/document-2.png")
            makeWindowActive(resume_window)
            break;
        case "Projects":
            projects_window = document.getElementById("ProjectsWindow")
            projects_window.style.display = "flex";
            construct_taskbar_button("ProjectsButton", "Projects", "ProjectsWindow", "assets/textures/opti/folder-5.png")
            makeWindowActive(projects_window)
            break;
        case "Contact Me":
            var email = "sujitsaravanan15@gmail.com";
            var subject = "Contact from portfolio";
            var emailBody = "message.from";
            document.location = "mailto:"+email+"?subject="+subject+"&body=";
            break;
        case "Help":
            help_window = document.getElementById("HelpWindow")
            help_window.style.display = "flex";
            construct_taskbar_button("HelpButton", "Help", "HelpWindow", "assets/textures/opti/help-book-3.png")
            makeWindowActive(help_window)
            break;
        default:
    }
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
    console.log({tops, bots, rights, lefts})

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
        document.onmouseup = closeDragElement;
        document.onmousemove = elementResizeSouthEast;
    }
    function resizeMouseDownNorthEast(e){
        e.preventDefault();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementResizeNorthEast;
    }
    function resizeMouseDownSouthWest(e){
        e.preventDefault();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementResizeSouthWest;
    }
    function resizeMouseDownNorthWest(e){
        e.preventDefault();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementResizeNorthWest;
    }

    function resizeMouseDownNorth(e){
        e.preventDefault();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementResizeNorth;
    }
    function resizeMouseDownSouth(e){
        e.preventDefault();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementResizeSouth;
    }
    function resizeMouseDownEast(e){
        e.preventDefault();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementResizeEast;
    }
    function resizeMouseDownWest(e){
        e.preventDefault();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementResizeWest;
    }


    function elementResizeSouthEast(e){
        e.preventDefault();
        updatePos()

        prev_rights = rights;
        prev_bots = bots;
        bots = e.clientY;
        rights = e.clientX;
        
        if (bots - tops <= 200)
            bots = prev_bots;
        if (rights - lefts <= 200)
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
        
        if (bots - tops <= 200)
            tops = prev_tops;
        if (rights - lefts <= 200)
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
        
        if (bots - tops <= 200)
            bots = prev_bots;
        if (rights - lefts <= 200)
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
        
        if (bots - tops <= 200)
            tops = prev_tops;
        if (rights - lefts <= 200)
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

        console.log(window_position_map.get(elmnt.id))
        prev_tops = tops;
        tops = e.clientY;
        
        if (bots - tops <= 200)
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

        if (bots - tops <= 200)
            bots = prev_bots;

        window_position_map.set(elmnt.id, {top: tops, left: lefts, bottom: bots, right: rights})
        elmnt.style.height = bots - tops + "px  ";
    }
    function elementResizeEast(e){
        e.preventDefault();
        updatePos()

        prev_rights = rights
        rights = e.clientX;

        if (rights - lefts <= 200)
            rights = prev_rights;

        window_position_map.set(elmnt.id, {top: tops, left: lefts, bottom: bots, right: rights})
        elmnt.style.width = rights - lefts + "px  ";
    }
    function elementResizeWest(e){
        e.preventDefault();
        updatePos()

        prev_lefts = lefts;
        lefts = e.clientX;

        if (rights - lefts  <= 200)
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

function close_window(button){
    const window = button.parentNode.parentNode.parentNode;
    window.style.display = "none";
    switch (window.id) {
        case "ResumeWindow":
            taskbar.removeChild(document.getElementById("ResumeButton"));
            break;
        case "ProjectsWindow":
            taskbar.removeChild(document.getElementById("ProjectsButton"));
            break;
        case "ContactWindow":
            taskbar.removeChild(document.getElementById("ContactButton"));
            break;
        case "HelpWindow":
            taskbar.removeChild(document.getElementById("HelpButton"));
            break;
        default:
    }
}
function minimize_window(button){
    const window = button.parentNode.parentNode.parentNode;
    window.style.display = "none";
}
function maximize_window(button){
    const window = button.parentNode.parentNode.parentNode;
    makeWindowActive(window);
    const maximized_positions = {top: 0, left: 0, bottom: document.documentElement.scrollHeight - taskbar.offsetHeight - 4, right: document.documentElement.scrollWidth - 4};
    window_position_map.set(window.id, maximized_positions)

    window.style.top = maximized_positions.top + "px";
    window.style.left = maximized_positions.left + "px";
    window.style.width = maximized_positions.right + "px";
    window.style.height = maximized_positions.bottom + "px";
}
