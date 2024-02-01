// eslint-disable-next-line
frappe.ui.form.Footer = class extends frappe.ui.form.Footer {
    make_comment_box() {
        this.frm.comment_box = frappe.ui.form.make_control({
            parent: this.wrapper.find(".comment-box"),
            render_input: true,
            only_input: true,
            enable_mentions: true,
            df: {
                fieldtype: "Comment",
                fieldname: "comment",
            },
            on_submit: (comment, custom_visibility) => {
                if (strip_html(comment).trim() != "" || comment.includes("img")) {
                    this.frm.comment_box.disable();
                    frappe
                        .xcall("frappe.desk.form.utils.add_comment", {
                            reference_doctype: this.frm.doctype,
                            reference_name: this.frm.docname,
                            content: comment,
                            comment_email: frappe.session.user,
                            comment_by: frappe.session.user_fullname,
                            custom_visibility: custom_visibility,
                        })
                        .then((comment) => {
                            let comment_item =
                                this.frm.timeline.get_comment_timeline_item(comment);
                            this.frm.comment_box.set_value("");
                            frappe.utils.play_sound("click");
                            this.frm.timeline.add_timeline_item(comment_item);
                            this.frm.sidebar.refresh_comments_count &&
                                this.frm.sidebar.refresh_comments_count();
                        })
                        .finally(() => {
                            this.frm.comment_box.enable();
                        });
                    this.refresh();
                }
            },
        });
    }
};
