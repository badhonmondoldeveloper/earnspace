# User Onboarding

## Current registration behavior

Registration validates the submitted name, username, email, and password, normalizes the username/email, and creates the user, profile, settings, wallet, and initial Personal Space in one Prisma transaction. Username and email uniqueness are enforced by the database.

A new account currently enters the platform immediately after registration. Email verification and a guided onboarding screen are not yet enabled by default.

## Target flow

The planned flow is:

1. Validate account data and reserve the normalized username.
2. Create the user and initial profile resources transactionally.
3. Send an expiring, one-time verification link when email verification is enabled.
4. Complete or skip profile, interests, creator category, and Personal Space setup.
5. Enter the dashboard with a measurable profile-completion state.

Onboarding should remain skippable for non-essential fields. It must not collect personal data that is not needed for the selected account type.

## Account types

A single authentication system supports `PERSONAL`, `CREATOR`, and `BUSINESS` account types. A personal account can later opt into creator or business capabilities without creating a second login identity.

## Production limitations

The repository includes the database fields needed for email verification, but the delivery provider, verification route, onboarding UI, interests flow, and creator suggestions still require implementation and external configuration. These are intentionally not described as live features.
