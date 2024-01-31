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
                        <input type="checkbox" autocomplete="off" class="input-with-feedback" data-fieldtype="Check" data-fieldname="visible_to_mentioned_users">
                        <span class="label-area">Visible to mentioned users</span>
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

        this.visible_to_mentioned_users = this.comment_wrapper.find('input[type="checkbox"]');
    }

    submit() {
        const checked = this.visible_to_mentioned_users.prop("checked");
        this.on_submit && this.on_submit(this.get_value(), checked);
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
