/** @jsxImportSource react */

import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify Your Account</title>

        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>Your verification code is {otp}</Preview>

      <Body
        style={{
          backgroundColor: "#f4f4f5",
          fontFamily: "Roboto, Arial, sans-serif",
          margin: 0,
          padding: "20px",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "30px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Section>
            <Row>
              <Heading
                as="h2"
                style={{
                  color: "#18181b",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                Verify Your Account
              </Heading>
            </Row>

            <Row>
              <Text
                style={{
                  color: "#3f3f46",
                  fontSize: "16px",
                  lineHeight: "24px",
                }}
              >
                Hello {username},
              </Text>
            </Row>

            <Row>
              <Text
                style={{
                  color: "#3f3f46",
                  fontSize: "16px",
                  lineHeight: "24px",
                }}
              >
                Thank you for registering with HiddenVoice. Please use the
                verification code below to complete your registration.
              </Text>
            </Row>

            <Row>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: "32px",
                  fontWeight: "bold",
                  letterSpacing: "8px",
                  color: "#2563eb",
                  margin: "30px 0",
                }}
              >
                {otp}
              </Text>
            </Row>

            <Row>
              <Text
                style={{
                  color: "#52525b",
                  fontSize: "14px",
                  lineHeight: "22px",
                }}
              >
                This verification code is valid for a limited time. Please do
                not share it with anyone.
              </Text>
            </Row>

            <Row>
              <Text
                style={{
                  color: "#52525b",
                  fontSize: "14px",
                  lineHeight: "22px",
                }}
              >
                If you did not request this verification code, you can safely
                ignore this email.
              </Text>
            </Row>

            <Row>
              <Text
                style={{
                  marginTop: "30px",
                  color: "#71717a",
                  fontSize: "12px",
                  textAlign: "center",
                }}
              >
                © {new Date().getFullYear()} HiddenVoice. All rights reserved.
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}