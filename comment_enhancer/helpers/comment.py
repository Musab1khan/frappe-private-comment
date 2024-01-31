from frappe.desk.notifications import extract_mentions


def get_mention_user(content):
    if not content:
        return []

    users = extract_mentions(content)
    mention_users = []

    for user in users:
        mention_users.append({"user": user})

    return mention_users
