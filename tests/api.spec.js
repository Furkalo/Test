import { test, expect } from "@playwright/test";

test.describe("Pure API tests for booking", () => {
  let bookingId;

  test("1. Create a booking (User API)", async ({ request }) => {
    const booking = {
      roomid: 1,
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      phone: "1234567890",
      bookingdates: {
        checkin: "2025-09-20",
        checkout: "2025-09-25",
      },
    };

    const response = await request.post(
      "https://automationintesting.online/booking",
      {
        data: booking,
      }
    );

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.bookingid).toBeDefined();

    bookingId = body.bookingid;
  });

  test("2. Verify booking exists (User API)", async ({ request }) => {
    const response = await request.get(
      "https://automationintesting.online/booking"
    );
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    const booking = body.find((b) => b.bookingid === bookingId);
    expect(booking).toBeDefined();
  });

  test("3. Update booking (User API)", async ({ request }) => {
    const updatedBooking = {
      roomid: 1,
      firstname: "Jane",
      lastname: "Smith",
      email: "jane@example.com",
      phone: "9876543210",
      bookingdates: {
        checkin: "2025-09-21",
        checkout: "2025-09-26",
      },
    };

    const response = await request.put(
      `https://automationintesting.online/booking/${bookingId}`,
      { data: updatedBooking }
    );

    expect(response.ok()).toBeTruthy();

    const verify = await request.get(
      `https://automationintesting.online/booking/${bookingId}`
    );
    const body = await verify.json();
    expect(body.firstname).toBe("Jane");
  });

  test("4. Delete booking (User API)", async ({ request }) => {
    const response = await request.delete(
      `https://automationintesting.online/booking/${bookingId}`
    );
    expect(response.ok()).toBeTruthy();

    // Перевірка, що бронювання видалене
    const verify = await request.get(
      `https://automationintesting.online/booking/${bookingId}`
    );
    expect(verify.status()).toBe(404);
  });
});
