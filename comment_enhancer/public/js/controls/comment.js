// eslint-disable-next-line
frappe.ui.form.ControlComment = class extends frappe.ui.form.ControlComment {
    make_wrapper() {
        this.comment_wrapper = !this.no_wrapper
            ? $(`
            <div class="comment-input-wrapper">
                <div class="comment-input-header">
                <span>${__("Comments")}</span>
                </div>
                <div class="comment-input-container">
                ${frappe.avatar(frappe.session.user, "avatar-medium")}
                    <div class="frappe-control col"></div>
                </div>
                <div class="checkbox hidden form-inline form-group" style="margin-left:48px;padding-top:0.5rem;">
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
                </div>
                <button class="btn hidden btn-comment btn-xs" style="margin-left:48px; margin-top:0px;">
                    ${__("Comments")}
                </button>
            </div>
        `)
            : $('<div class="frappe-control"></div>');

        this.comment_wrapper.appendTo(this.parent);

        // wrapper should point to frappe-control
        this.$wrapper = !this.no_wrapper
            ? this.comment_wrapper.find(".frappe-control")
            : this.comment_wrapper;

        this.wrapper = this.$wrapper;

        this.button = this.comment_wrapper.find(".btn-comment");

        this.mention_wrapper = this.comment_wrapper.find(".checkbox");

        this.comment_visibility = this.comment_wrapper.find("#visibility");
    }

    submit() {
        this.on_submit && this.on_submit(this.get_value(), this.comment_visibility.prop("value"));
    }

    update_state() {
        const value = this.get_value();
        if (strip_html(value).trim() != "" || value.includes("img")) {
            this.button.removeClass("hidden").addClass("btn-primary");
            this.mention_wrapper.removeClass("hidden");
        } else {
            this.mention_wrapper.addClass("hidden");
            this.button.addClass("hidden").removeClass("btn-primary");
        }
    }
};
