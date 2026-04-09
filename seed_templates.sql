-- Seed communication templates
-- Run this in the Supabase SQL Editor

-- Ensure templates table has the right columns
alter table templates add column if not exists name text;
alter table templates add column if not exists subject text;
alter table templates add column if not exists body text;
alter table templates add column if not exists category text;
alter table templates add column if not exists sort_order integer;

-- Seed templates
insert into templates (id, name, subject, body, category, sort_order) values

('d1000000-0000-0000-0000-000000000001',
'Preseason Welcome',
'Welcome to Team Illinois [Year] | Important Links and First Steps',
E'Team Illinois Families,\n\nWelcome to the season. This note is meant to get everyone pointed to the right places before our first practices begin.\n\nThe TI Training Schedule workbook is our official schedule source. TeamSnap is the convenience layer for team-level reminders and attendance, so please make sure you are on your team and receiving notifications.\n\nPlease also review the TI newsletter for the larger season overview, event notes, and program information. Over the course of the year, most emails will focus on what changed, what is due, and what action you need to take.\n\nAction items for this week:\n• Confirm you are in the correct TeamSnap team\n• Review the training schedule workbook\n• Check your player gear and pinnies\n• Watch for any team-specific notes from your TeamSnap or social coordinator\n\nPlease reach out with any logistics questions. We are excited to get started.\n\nThanks,\n[Name]',
'Season Launch', 1),

('d1000000-0000-0000-0000-000000000002',
'Volunteer Role Confirmation',
'Team Illinois | Team Coordinator and Social Chair Confirmation',
E'Team Illinois Families,\n\nAs we get ready for the season, we are confirming our parent volunteer roles for each team. These roles make a meaningful difference in helping coaches stay focused on the field while families stay informed.\n\nWe are looking to confirm the following support roles for [Team]:\n• TeamSnap / communication support\n• Social coordinator\n• Event-day setup help as needed\n\nIf you are able to help, please reply to this email and let us know which role fits best. Once roles are set, we will share expectations and the preferred workflow.\n\nThank you in advance for helping the boys have a great season.\n\nThanks,\n[Name]',
'Season Launch', 2),

('d1000000-0000-0000-0000-000000000003',
'Weekly Update',
'Team Illinois | Weekly Update for [Dates]',
E'Team Illinois,\n\nPlease see below for this week''s key updates. For larger program information, continue to use the TI newsletter and the training schedule workbook.\n\nUpdates\n• Training Schedule: [brief note on what changed or what to review]\n• Attendance / TeamSnap: [specific ask]\n• Event / Travel: [next important item]\n• Gear / Admin: [store deadline, correction window, or reminder]\n\nReminders\n• The training schedule workbook remains the official schedule source\n• TeamSnap should be updated for all upcoming events\n• Please direct logistics questions to me so coaches can stay focused on coaching\n\nPlease don''t hesitate to reach out with any questions.\n\nThanks,\n[Name]',
'Weekly Operations', 3),

('d1000000-0000-0000-0000-000000000004',
'Attendance Reminder',
'Reminder | Please Update TeamSnap Availability',
E'Team Illinois Families,\n\nPlease take a moment today to update your TeamSnap availability for all currently posted practices and events.\n\nWe need accurate attendance data so our coaches can plan sessions, travel, and rosters appropriately. If your availability is still unknown, please mark that clearly rather than leaving the event blank.\n\nPlease complete this by [deadline].\n\nThank you for helping us stay organized.\n\nThanks,\n[Name]',
'Weekly Operations', 4),

('d1000000-0000-0000-0000-000000000005',
'Schedule Change / Weather Pivot',
'Team Illinois | Schedule Change for [Date]',
E'Team Illinois Families,\n\nWe have made a change to the TI Training Schedule for [date / upcoming week]. Please review the updated workbook and adjust your calendars accordingly.\n\nThe most important changes are:\n• [Team / grad year] — [new time and location]\n• [Team / grad year] — [new time and location]\n• [Team / grad year] — [off / cancelled / unchanged]\n\nTeamSnap coordinators: please make sure your team matches the workbook as soon as possible.\n\nThanks for your flexibility.\n\nThanks,\n[Name]',
'Weekly Operations', 5),

('d1000000-0000-0000-0000-000000000006',
'Same-Day Change Alert',
'Immediate Update | [Event / Practice] Change for Today',
E'Team Illinois Families,\n\nPlease note the following immediate change for today:\n\n[Insert the new time, location, or bracket update here.]\n\nPlease rely on this note and the updated workbook / TeamSnap entry going forward. We will send another message only if additional changes come through.\n\nThanks,\n[Name]',
'Weekly Operations', 6),

('d1000000-0000-0000-0000-000000000007',
'Gear / Store Reminder',
'Team Illinois | Gear / Store Deadline Reminder',
E'Team Illinois Families,\n\nThis is a reminder that the [helmet order / team store / correction window] closes on [date].\n\nIf your player still needs a replacement item, sizing adjustment, or add-on order, please take care of it before the deadline above. Once the window closes, we may not be able to make changes until the next cycle.\n\nIf you have already submitted your order or issue, thank you. If not, please act today.\n\nThanks,\n[Name]',
'Gear & Store', 7),

('d1000000-0000-0000-0000-000000000008',
'Hotel Booking Push',
'Team Illinois | Hotel Booking Reminder for [Event]',
E'Team Illinois Families,\n\nHotel information for [event] is now live. Please book as soon as possible using the team links below.\n\nImportant notes:\n• Booking deadline: [date]\n• Team / site guidance: [link or note]\n• Family coordination note: [same-hotel guidance, room merge note, etc.]\n\nSocial coordinators: please use TeamSnap to help keep as many families together as possible.\n\nIf you have travel questions before booking, please reach out.\n\nThanks,\n[Name]',
'Travel & Events', 8),

('d1000000-0000-0000-0000-000000000009',
'Final Travel Weekend Logistics',
'Team Illinois | Final Details for [Event This Weekend]',
E'Team Illinois Families,\n\nWe are heading into [event] this weekend. Please review the final logistics below.\n\n• Venue / field site: [location]\n• Live schedule source: [link]\n• Arrival time: [time]\n• Uniform / gear: [details]\n• Weather / contingency note: [details]\n• Team dinner / social plan: [details if applicable]\n\nIf any posted schedules are still shifting, we will communicate updates as soon as we receive them.\n\nSafe travels and please reach out with any urgent issues.\n\nThanks,\n[Name]',
'Travel & Events', 9),

('d1000000-0000-0000-0000-000000000010',
'Memorial Day Weekend Master Logistics',
'Team Illinois | Memorial Day Weekend Final Plan',
E'Team Illinois Families,\n\nBelow is the current master plan for Memorial Day weekend. Please note that some event details may still tighten as we get closer.\n\n• Friday: [arrival / hotel guidance]\n• Saturday: [college game, practice field, or travel plan]\n• Sunday: [game volume / venue]\n• Monday: [final game / departure plan]\n• Social / team-bonding: [details]\n\nWe will continue to separate confirmed details from still-pending details so you know exactly what can be acted on now.\n\nThanks,\n[Name]',
'Travel & Events', 10),

('d1000000-0000-0000-0000-000000000011',
'Summer Hotel / Travel Instructions',
'Team Illinois | Summer Hotel and Travel Instructions for [Event]',
E'Team Illinois Families,\n\nSummer event information for [event] is now available. Please review the details below and book as soon as possible.\n\nHotel information:\n• Recommended hotel: [hotel name and link]\n• Booking deadline: [date]\n• Notes: [stay-to-play requirement or family clustering guidance]\n\nEvent schedule:\n• Dates: [dates]\n• Location: [venue / city]\n• Schedule link: [link when available]\n\nIf two linked events share the same hotel block, you do not need to rebook — your existing reservation will carry over.\n\nPlease reach out with any questions before booking.\n\nThanks,\n[Name]',
'Travel & Events', 11),

('d1000000-0000-0000-0000-000000000012',
'Family Event / Ticketing Note',
'Team Illinois | [Event] Details and Ticketing Information',
E'Team Illinois Families,\n\nWe are excited for [event] on [date]. Please review the key details below.\n\n• Meeting point / arrival window: [details]\n• Ticket link or purchase process: [details]\n• Team attire: [details]\n• Team social / post-event plan: [details]\n\nIf your family has any questions before the event, please let me know.\n\nThanks,\n[Name]',
'Travel & Events', 12),

('d1000000-0000-0000-0000-000000000013',
'Policy Reminder: Outside Lacrosse Conflicts',
'Team Illinois | Spring and Summer Priority Reminder',
E'Team Illinois Families,\n\nAs we move into the spring and summer seasons, I want to clearly restate our policy on outside lacrosse conflicts.\n\nWhen you accept a Team Illinois roster spot, Team Illinois competition dates must be treated as the top lacrosse priority. If a player chooses another lacrosse event that conflicts with a Team Illinois competition date, that decision may affect his roster status.\n\nWe understand that community and school-related matters may occasionally create unique situations. If you believe you have a legitimate conflict, please communicate early so we can review it thoughtfully.\n\nThank you for helping us keep expectations clear and fair across the program.\n\nThanks,\n[Name]',
'Policy', 13),

('d1000000-0000-0000-0000-000000000014',
'U10 Welcome and Next Steps',
'Welcome to Team Illinois U10 | Important Next Steps',
E'Team Illinois U10 Families,\n\nWelcome to Team Illinois. We are excited to get this group started and will share information in a simple, step-by-step way so nobody gets overloaded.\n\nYour next steps are:\n• Confirm your spot by [deadline]\n• Accept your TeamSnap invitation\n• Review the kickoff-meeting date and plan to attend\n• Verify your player name, jersey details, and any requested information\n• Watch for hotel, schedule, and gear notes in the coming weeks\n\nPlease do not worry if every future detail is not included in this first note. We will continue to release information as it becomes relevant.\n\nThanks,\n[Name]',
'New Families', 14),

('d1000000-0000-0000-0000-000000000015',
'Kickoff Meeting Follow-Up',
'Team Illinois | Kickoff Meeting Follow-Up and Action Items',
E'Team Illinois Families,\n\nThank you to everyone who joined the kickoff meeting. Below are the key follow-up items.\n\n• TeamSnap: [status / action]\n• Roster-card or player-information corrections: [deadline]\n• Hotel / travel information: [status]\n• Gear / sideline store: [status]\n• Next practice or event: [details]\n\nIf you missed the meeting and still have questions, please reach out directly and I will help you get caught up.\n\nThanks,\n[Name]',
'New Families', 15),

('d1000000-0000-0000-0000-000000000016',
'Tryout Announcement',
'Team Illinois Tryouts Are Open | Register Now',
E'Team Illinois Families,\n\nRegistration for our late-July tryouts is now open. Please use the tryout link below to register in league apps, and review the season-plan snapshot so your family can see the broad outline for the upcoming year before tryouts.\n\nWhat to do now:\n• Register using the tryout link: [link]\n• Review the season-plan overview: [link]\n• Share the tryout announcement with any family that may still be deciding\n• Review the Lax.com team store link if you plan to order optional TI gear during this window: [link]\n\nWe will send more detailed tryout logistics, including check-in timing and what to bring, closer to the event.\n\nThank you,\n[Name]',
'Registration & Tryouts', 16),

('d1000000-0000-0000-0000-000000000017',
'Post-Tryout Acceptance and Equipment Next Steps',
'Team Illinois | Next Steps After Tryouts',
E'Team Illinois Families,\n\nThank you for attending tryouts. We are excited to move forward with the players who have accepted their spots. Because our production timelines move quickly, we will place the helmet, glove, jersey, bag, and equipment orders within one week of tryouts.\n\nPlease complete the following immediately:\n• Accept your roster spot and complete registration\n• Confirm all sizes, player spelling, and required order information\n• Reply right away with any correction to jersey name, jersey number, or equipment sizing\n\nIf we do not hear from you before the stated deadline, we will proceed using the information on file.\n\nThank you,\n[Name]',
'Registration & Tryouts', 17),

('d1000000-0000-0000-0000-000000000018',
'Post-Season Wrap-Up',
'Team Illinois | Season Wrap-Up and What Comes Next',
E'Team Illinois Families,\n\nThank you for a great season. We appreciate the energy, flexibility, and support your families brought throughout the year.\n\nOver the next few weeks we will finalize any remaining gear, travel, or administrative loose ends. We will also begin preparing next-season information and will share future updates when ready.\n\nIf there is anything unresolved on your end, please reach out so we can close the loop.\n\nThanks again,\n[Name]',
'Season Close', 18)

on conflict (id) do nothing;
