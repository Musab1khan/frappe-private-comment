import frappe
from frappe.desk.doctype.notification_log.notification_log import NotificationLog


class CareersOverrideNotificationLog(NotificationLog):
    def after_insert(self):
        if self.type == "Mention":
            self.update_comment_link()
        super().after_insert()

    def update_comment_link(self):
        """
        There is no direct link between the comment and the notification log.
        We determine the comment id by using the content of the email and the most recently created comment, as the comment is created before the notification log.
        """
        comments = frappe.get_all(
            "Comment",
            filters={
                "reference_doctype": self.document_type,
                "reference_name": self.document_name,
                "reference_owner": self.for_user,
            },
            fields=["name", "content"],
            order_by="creation desc",
        )

        comment_name = None

        for comment in comments:
            if comment.content in self.email_content:
                comment_name = comment.name
                break

        if comment_name:
            self.link = self.link + f"#comment-{comment_name}"
            self.save()
