"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw Object.assign(new Error(detail?.message || "Login failed"), {
          detail,
        });
      }
      toast({ title: "Welcome back!", description: "You are now signed in." });
      router.replace("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const fieldErrors = e?.detail?.detail;
      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach((err) => {
          if (err?.loc?.[1]) form.setError(err.loc[1], { message: err.msg });
        });
      }
      toast({
        title: "Login failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh grid md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-muted">
        <div className="max-w-sm p-6">
          <h1 className="text-2xl font-semibold text-balance">
            Asaan Hai Coding Admin
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Manage users, courses, lessons, projects and media in one place.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="you@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          placeholder="••••••••"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>
            <div className="mt-3">
              <a
                href="#"
                className="text-xs text-muted-foreground hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
