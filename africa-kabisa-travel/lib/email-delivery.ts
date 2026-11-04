type EmailSubmissionResult = {
  data?: { id?: string } | null;
  error?: { message: string } | null;
};

// A successful API request confirms acceptance, not delivery to the inbox.
export function requireEmailAccepted(result: EmailSubmissionResult) {
  if (result.error) {
    throw new Error(`Email submission failed: ${result.error.message}`);
  }

  if (!result.data?.id?.trim()) {
    throw new Error("The email service did not confirm acceptance.");
  }

  return result.data.id;
}
