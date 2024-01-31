from typing import TYPE_CHECKING

import frappe
from frappe.core.doctype.file.utils import extract_images_from_html
from frappe.desk.form.document_follow import follow_document

from comment_enhancer.helpers.comment import get_mention_user

if TYPE_CHECKING:
    from frappe.core.doctype.comment.comment import Comment


@frappe.whitelist(methods=["POST", "PUT"])
def add_comment_override(
    reference_doctype: str,
    reference_name: str,
    content: str,
    comment_email: str,
    comment_by: str,
    custom_visible_to_mentioned_users: bool = False,
) -> "Comment":
    """Allow logged user with permission to read document to add a comment"""
    reference_doc = frappe.get_doc(reference_doctype, reference_name)
    reference_doc.check_permission()

    comment = frappe.new_doc("Comment")
    comment.update(
        {
            "comment_type": "Comment",
            "reference_doctype": reference_doctype,
            "reference_name": reference_name,
            "comment_email": comment_email,
            "comment_by": comment_by,
            "content": extract_images_from_html(
                reference_doc, content, is_private=True
            ),
            "custom_visible_to_mentioned_users": custom_visible_to_mentioned_users,
            "custom_mentions": get_mention_user(content),
        }
    )
    comment.insert(ignore_permissions=True)

    if frappe.get_cached_value(
        "User", frappe.session.user, "follow_commented_documents"
    ):
        follow_document(
            comment.reference_doctype, comment.reference_name, frappe.session.user
        )

    return comment
