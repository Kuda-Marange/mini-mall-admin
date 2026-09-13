import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { firstName, lastName, email, password, setupCode } = await request.json();

  if (!firstName || !lastName || !email || !password || !setupCode) {
    return NextResponse.json(
      { error: "First name, last name, email, password, and setup code are all required." },
      { status: 400 }
    );
  }

  if (setupCode !== process.env.ADMIN_SETUP_CODE) {
    return NextResponse.json({ error: "Invalid setup code." }, { status: 403 });
  }

  if (
    typeof password !== "string" ||
    password.length < 13 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    return NextResponse.json(
      {
        error:
          "Password must be at least 13 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.",
      },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}