
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { processTildaLead, processTildaOrder } from "../../lib/tildaWebhookHandler.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the raw request body as text and log it
    const rawBody = await req.text();
    console.log("Received webhook from Tilda:", rawBody);
    
    // Try parsing the body as JSON, but handle form-urlencoded as well
    let payload;
    if (req.headers.get("content-type")?.includes("application/json")) {
      try {
        payload = JSON.parse(rawBody);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        // Try to parse URL encoded form data
        payload = Object.fromEntries(new URLSearchParams(rawBody));
      }
    } else {
      // Handle URL encoded form data (default for Tilda)
      payload = Object.fromEntries(new URLSearchParams(rawBody));
    }
    
    console.log("Parsed payload:", payload);
    
    // Determine if this is a lead (form/quiz submission) or order
    let result;
    
    // Check if this is an order submission by looking for typical order fields
    if (payload.orderid || payload.payment || payload.products || 
        payload.formid === "order" || payload.formname?.toLowerCase().includes("заказ")) {
      console.log("Processing as an order");
      result = await processTildaOrder(payload);
    } else {
      console.log("Processing as a lead");
      result = await processTildaLead(payload);
    }
    
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error processing Tilda webhook:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
