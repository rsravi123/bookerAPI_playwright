/**
 * TypeScript interfaces for Booking API models
 * Converted from Java DTOs
 */
export interface BookingDates {
    checkin: string;
    checkout: string;
}
export interface BookingDetails {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: BookingDates;
    additionalneeds: string;
}
export interface BookingDTO {
    booking: BookingDetails;
    bookingid: string | number;
}
export interface BookingID {
    bookingid: string | number;
}
export interface AuthToken {
    token: string;
}
//# sourceMappingURL=types.d.ts.map