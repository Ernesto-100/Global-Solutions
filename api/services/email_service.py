"""Email service using Resend."""

from config import settings


async def send_invoice_email(invoice) -> None:
    """Send an invoice to the client."""
    try:
        import resend
        resend.api_key = settings.RESEND_API_KEY

        resend.Emails.send({
            "from": f"TrueBooks <{settings.FROM_EMAIL}>",
            "to": [invoice.client_email],
            "subject": f"Invoice {invoice.invoice_number} from TrueBooks",
            "html": _invoice_email_html(invoice),
        })
    except Exception as e:
        print(f"[Email] Failed to send invoice email: {e}")


async def send_overdue_reminder(invoice) -> None:
    """Send an overdue payment reminder."""
    try:
        import resend
        resend.api_key = settings.RESEND_API_KEY

        resend.Emails.send({
            "from": f"TrueBooks <{settings.FROM_EMAIL}>",
            "to": [invoice.client_email],
            "subject": f"Payment Reminder: Invoice {invoice.invoice_number}",
            "html": _overdue_email_html(invoice),
        })
    except Exception as e:
        print(f"[Email] Failed to send overdue reminder: {e}")


async def send_welcome_email(user) -> None:
    """Send welcome email to new users."""
    try:
        import resend
        resend.api_key = settings.RESEND_API_KEY

        resend.Emails.send({
            "from": f"TrueBooks <{settings.FROM_EMAIL}>",
            "to": [user.email],
            "subject": "Welcome to TrueBooks — let's get your books set up",
            "html": _welcome_email_html(user),
        })
    except Exception as e:
        print(f"[Email] Failed to send welcome email: {e}")


def _invoice_email_html(invoice) -> str:
    return f"""
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px">
        <h1 style="color:#16a34a;font-size:24px">Invoice {invoice.invoice_number}</h1>
        <p>Hi,</p>
        <p>Please find your invoice for <strong>${invoice.total:,.2f}</strong> attached.</p>
        <p><strong>Due date:</strong> {invoice.due_date.strftime('%B %d, %Y') if invoice.due_date else 'On receipt'}</p>
        <a href="#" style="display:inline-block;background:#16a34a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin:20px 0">
            Pay Invoice →
        </a>
        <p style="color:#666;font-size:12px">Powered by TrueBooks · The bookkeeping tool small businesses trust.</p>
    </div>
    """


def _overdue_email_html(invoice) -> str:
    return f"""
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px">
        <h1 style="color:#dc2626;font-size:24px">Payment Reminder</h1>
        <p>Invoice {invoice.invoice_number} for <strong>${invoice.total:,.2f}</strong> is overdue.</p>
        <a href="#" style="display:inline-block;background:#16a34a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin:20px 0">
            Pay Now →
        </a>
    </div>
    """


def _welcome_email_html(user) -> str:
    return f"""
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px">
        <h1 style="color:#16a34a">Welcome to TrueBooks, {user.name}!</h1>
        <p>We're thrilled you're here. Your 14-day free trial has started.</p>
        <p>Here's what to do first:</p>
        <ol>
            <li>Import your data from QuickBooks (10 minutes)</li>
            <li>Connect your bank account</li>
            <li>Chat with us if you need anything</li>
        </ol>
        <a href="https://app.truebooks.io" style="display:inline-block;background:#16a34a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">
            Open TrueBooks →
        </a>
    </div>
    """
