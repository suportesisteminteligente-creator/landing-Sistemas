exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    const pixelId = "478303434960188";
    const accessToken = process.env.META_ACCESS_TOKEN;

    const payload = {
      data: [
        {
          event_name: body.event_name || "Lead",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_id: body.event_id,
          event_source_url: body.event_source_url,
          user_data: {
            client_user_agent: event.headers["user-agent"] || "",
            client_ip_address: event.headers["x-forwarded-for"] || ""
          }
        }
      ]
    };

    const response = await fetch(
      `https://graph.facebook.com/v23.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
