"""Stripe webhook handler."""

import stripe
from fastapi import APIRouter, Request, HTTPException
from config import settings

router = APIRouter()
stripe.api_key = settings.STRIPE_SECRET_KEY


@router.post("/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        raise HTTPException(400, "Invalid webhook signature")

    event_type = event["type"]

    if event_type == "customer.subscription.created":
        await _handle_subscription_created(event["data"]["object"])
    elif event_type == "customer.subscription.deleted":
        await _handle_subscription_cancelled(event["data"]["object"])
    elif event_type == "invoice.payment_succeeded":
        await _handle_payment_succeeded(event["data"]["object"])
    elif event_type == "invoice.payment_failed":
        await _handle_payment_failed(event["data"]["object"])

    return {"received": True}


async def _handle_subscription_created(subscription):
    pass  # Update org plan in DB


async def _handle_subscription_cancelled(subscription):
    pass  # Downgrade org to free/cancel


async def _handle_payment_succeeded(invoice):
    pass  # Confirm subscription active


async def _handle_payment_failed(invoice):
    pass  # Send payment failure email
