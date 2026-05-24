import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Privacy Policy — QueryAI',
  description: 'How QueryAI collects, uses, and protects your information.',
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: May 20, 2025</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. Information We Collect</h2>
            <p>
              QueryAI collects only the information necessary to provide the service. When you upload a data file,
              it is processed in-memory and optionally stored in a session-scoped PostgreSQL table. Files are
              associated with a randomly generated session ID and are not linked to any personal identity.
            </p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Uploaded file content (parsed into tabular rows and columns)</li>
              <li>Natural language queries you submit</li>
              <li>Session identifiers (UUID, not linked to accounts)</li>
              <li>Basic browser/usage analytics (if enabled)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Generate SQL queries from your natural language questions</li>
              <li>Execute read-only queries against your uploaded data</li>
              <li>Return results, charts, and explanations in the interface</li>
              <li>Improve the accuracy and safety of our AI models</li>
            </ul>
            <p className="mt-2">
              We do <strong>not</strong> sell your data to third parties. We do not use your uploaded data to
              train AI models without explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">3. AI Model Providers</h2>
            <p>
              Queries are processed by third-party AI models via OpenRouter. Your question and a description of
              your data schema (column names and types) are sent to the selected model provider. Please review
              the privacy policies of:
            </p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Anthropic (Claude models)</li>
              <li>OpenAI (GPT-4o models)</li>
              <li>Meta (Llama models)</li>
              <li>Google (Gemini models)</li>
              <li>Mistral AI (Mistral models)</li>
              <li>OpenRouter (routing layer)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">4. Data Retention</h2>
            <p>
              Session data (uploaded rows, generated SQL) is retained for the duration of your browser session.
              If PostgreSQL storage is configured, data may persist until the session table is dropped. We do not
              retain conversation history beyond the active session.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">5. Cookies</h2>
            <p>
              We use a single cookie/local storage entry to remember your cookie consent preference. We do not use
              tracking or advertising cookies. You may decline cookie consent without affecting core functionality.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">6. Security</h2>
            <p>
              All communications between your browser and our servers use HTTPS. SQL guardrails prevent any
              destructive operations on your data — only SELECT queries are executed. Session tables are isolated
              per upload.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Access any data we hold about your session</li>
              <li>Request deletion of session data</li>
              <li>Opt out of analytics</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@queryai.dev" className="text-primary hover:underline">
                privacy@queryai.dev
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">8. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Changes will be posted on this page with an updated
              date. Continued use of the service constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
