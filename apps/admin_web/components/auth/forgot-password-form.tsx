"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export default function ForgotPasswordForm({
  onBackToLogin,
}: ForgotPasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    // temporary
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
        <CardDescription className="text-slate-400">
          {submitted
            ? "Check your email for reset instructions"
            : "Enter your email to receive a password reset link"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {submitted ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <p className="text-center text-slate-300">
              We've sent a password reset link to{" "}
              <span className="font-semibold">{email}</span>
            </p>
            <p className="text-sm text-slate-500 text-center">
              Check your email and follow the instructions. If you don't see it,
              check your spam folder.
            </p>
            <Button
              onClick={onBackToLogin}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white"
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold h-10"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            <Button
              type="button"
              onClick={onBackToLogin}
              variant="ghost"
              className="w-full text-slate-400 hover:text-slate-300"
            >
              Back to Login
            </Button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            Your security is our priority
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
