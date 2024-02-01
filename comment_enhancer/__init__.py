# flake8: noqa

__version__ = "0.0.1"


def patch_add_comments_in_timeline():
    import frappe.desk.form.load as frappe_load

    from comment_enhancer.helpers.comment import add_comments_in_timeline

    frappe_load.add_comments = add_comments_in_timeline


try:
    patch_add_comments_in_timeline()
except Exception:
    pass
