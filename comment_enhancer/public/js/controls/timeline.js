/**Enable the HTML Editor field preview mode by default using the provided function */
const time_line_interval_loop = setInterval(() => {
    let html_time_line_item = document.querySelectorAll(
        ".new-timeline > .timeline-items .timeline-item",
    );

    if (html_time_line_item.length != 0) {
        update_comments_timeline();
        clearInterval(time_line_interval_loop);
    }
}, 1000);

function update_comments_timeline() {
    let html_time_line_items = document.querySelectorAll(
        ".new-timeline > .timeline-items .timeline-item",
    );

    for (let index = 0; index < html_time_line_items.length; index++) {
        if (html_time_line_items[index].querySelector(".visibility-info")) {
            return;
        }
        update_time_line(html_time_line_items[index]);
    }
}

function button_handle(event) {
    let html_time_line_items = document.querySelectorAll(
        ".new-timeline > .timeline-items .timeline-item",
    );

    for (let index = 0; index < html_time_line_items.length; index++) {
        if (html_time_line_items[index].dataset.name == event.target.dataset.name) {
            return button_override(html_time_line_items[index], event.target);
        }
    }
}

function update_time_line(time_line_item) {
    if (!("doctype" in time_line_item.dataset)) {
        return;
    }

    if (time_line_item.dataset.doctype != "Comment") {
        return;
    }

    frappe.call({
        method: "comment_enhancer.overrides.whitelist.comment.get_comment_visibility",
        args: {
            name: time_line_item.dataset.name,
        },
        callback: (res) => {
            if (time_line_item.querySelector(".visibility-info")) {
                time_line_item.querySelector(".visibility-info").remove();
            }
            if (res?.message?.custom_visibility) {
                time_line_item.querySelector(
                    ".timeline-message-box > span > span > span",
                ).innerHTML +=
                    ` . <span class="visibility-info">${res.message.custom_visibility}</span>`;
            } else {
                time_line_item.querySelector(
                    ".timeline-message-box > span > span > span",
                ).innerHTML += ` <span class="visibility-info"></span>`;
            }
        },
    });

    let button = time_line_item.querySelector(".custom-actions button");

    button.dataset.name = time_line_item.dataset.name;

    // Remove the event listener
    button.removeEventListener("click", button_handle, true);

    // Add the event listener
    button.addEventListener("click", button_handle, true);

    time_line_item
        .querySelector(".custom-actions")
        .lastChild.addEventListener("click", (button) => {
            time_line_item.querySelector(".timeline-comment").remove();
            time_line_item.querySelector(".custom-actions").classList.remove("save-open");
        });
}

function button_override(time_line_item, button) {
    if (time_line_item.querySelector(".custom-actions").classList.contains("save-open")) {
        handle_save(time_line_item, button);
    } else {
        handle_edit(time_line_item, button);
    }
}

function handle_save(time_line_item, button) {
    frappe.call({
        method: "frappe.desk.form.utils.update_comment",
        args: {
            name: time_line_item.dataset.name,
            content: time_line_item.querySelector(".comment-edit-box .ql-editor").innerHTML,
            custom_visibility: time_line_item.querySelector("#visibility").value,
        },
        callback: (r) => {
            time_line_item.querySelector(".timeline-comment").remove();
            time_line_item.querySelector(".custom-actions").classList.remove("save-open");
            update_time_line(time_line_item);
        },
    });
}

function handle_edit(time_line_item, button) {
    time_line_item.querySelector(".timeline-message-box").append(get_input_html());
    time_line_item.querySelector("#visibility").value =
        time_line_item.querySelector(".visibility-info").innerText;
    time_line_item.querySelector(".custom-actions").classList.add("save-open");
}

function get_input_html() {
    const div = document.createElement("div");
    div.className = "checkbox timeline-comment form-inline form-group";
    div.innerHTML = `
        <div class="comment-select-group">
            <label for="status" class="control-label text-muted small">Comment visibility:</label>
            <div class="select-input form-control">
                <select name="visibility" id="visibility" data-label="visibility" data-fieldtype="Select">
                    <option value="Visible to all" selected="selected">
                        Visible to all</option>
                    <option value="Visible to only me">
                        Visible to only me</option>
                    <option value="Visible to mentioned users">
                        Visible to mentioned users</option>
                </select>
                <div class="select-icon ">
                    <svg class="icon  icon-sm" style="">
                        <use class="" href="#icon-select"></use>
                    </svg>
                </div>
            </div>
        </div>

    `;
    return div;
}
