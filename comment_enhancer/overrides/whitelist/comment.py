from distutils.cygwinccompiler import get_versions
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
    custom_visibility: str = "Visible to all",
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
            "custom_visibility": custom_visibility,
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


@frappe.whitelist()
def update_comment_override(name, content):
    """allow only owner to update comment"""
    doc = frappe.get_doc("Comment", name)

    if frappe.session.user not in ["Administrator", doc.owner]:
        frappe.throw(
            frappe._("Comment can only be edited by the owner"), frappe.PermissionError
        )

    if doc.reference_doctype and doc.reference_name:
        reference_doc = frappe.get_doc(doc.reference_doctype, doc.reference_name)
        reference_doc.check_permission()

        doc.content = extract_images_from_html(reference_doc, content, is_private=True)
    else:
        doc.content = content

    doc.set("custom_mentions", get_mention_user(doc.content))

    doc.save(ignore_permissions=True)
