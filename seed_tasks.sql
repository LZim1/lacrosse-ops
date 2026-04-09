-- Seed all SOP tasks into the task library
-- Run this in the Supabase SQL Editor

insert into tasks (id, title, description, category, month_trigger) values

-- AUGUST (8) — Build the operating system before the season launches
('c1000000-0000-0000-0000-000000000001', 'Send preseason welcome email', 'Send welcome to all families with links to the training schedule workbook, TeamSnap, and newsletter.', 'Communication', 8),
('c1000000-0000-0000-0000-000000000002', 'Update TI newsletter for fall season', 'Refresh newsletter with season info, event notes, and key links before fall practices begin.', 'Communication', 8),
('c1000000-0000-0000-0000-000000000003', 'Finalize training schedule workbook', 'Confirm the workbook is complete and is the official source of truth, aligned with all coaches and facilities.', 'Scheduling', 8),
('c1000000-0000-0000-0000-000000000004', 'Set up TeamSnap teams and confirm volunteer coordinators', 'Create or refresh TeamSnap teams. Assign TeamSnap coordinators and social chairs per team.', 'TeamSnap & Volunteers', 8),
('c1000000-0000-0000-0000-000000000005', 'Prepare uniform distribution plan', 'Outline the late-registrant process, replacement workflow, and fit-issue tracking before the first practice.', 'Gear & Uniforms', 8),
('c1000000-0000-0000-0000-000000000006', 'Reconcile post-tryout equipment orders against roster', 'Verify helmets, gloves, jerseys, bags, and equipment orders match the final accepted roster. Flag any missing vendor confirmations.', 'Gear & Uniforms', 8),
('c1000000-0000-0000-0000-000000000007', 'Verify all players completed registration and size submission', 'Confirm every player on the roster has completed registration, size submission, and required ordering steps.', 'Registration & Tryouts', 8),
('c1000000-0000-0000-0000-000000000008', 'Build season issue log', 'Create a working tracker to manage open items for uniforms, equipment, attendance, vendors, and travel through the season.', 'Admin', 8),

-- SEPTEMBER (9) — Launch fall practices and establish standards immediately
('c1000000-0000-0000-0000-000000000009', 'Confirm opening-week practice times, locations, and coach assignments', 'Verify all details with coaches and facilities before communicating to families.', 'Scheduling', 9),
('c1000000-0000-0000-0000-000000000010', 'Send dress code reminder', 'Remind families of TI gear and uniform expectations for practices and events.', 'Communication', 9),
('c1000000-0000-0000-0000-000000000011', 'Ensure TeamSnap mirrors training schedule workbook', 'Ask TeamSnap coordinators to align their team view with the master workbook exactly.', 'TeamSnap & Volunteers', 9),
('c1000000-0000-0000-0000-000000000012', 'Open attendance chase for non-responding families', 'Identify families not responding to TeamSnap attendance prompts and follow up directly.', 'TeamSnap & Volunteers', 9),
('c1000000-0000-0000-0000-000000000013', 'Flag early travel announcements for fall follow-up', 'Note any major fall away events that will need hotel, logistics, or family communication later.', 'Travel & Events', 9),

-- OCTOBER (10) — Move from launch mode into disciplined weekly execution
('c1000000-0000-0000-0000-000000000014', 'Open Lax.com team stores (October window)', 'Launch October store window. Communicate store links, closing dates, ship timing, and who should order in the newsletter and weekly update.', 'Gear & Uniforms', 10),
('c1000000-0000-0000-0000-000000000015', 'Maintain live tracker for helmet orders, store deadlines, and uniform issues', 'Keep one running document covering all open gear items so nothing falls through at season''s peak.', 'Gear & Uniforms', 10),
('c1000000-0000-0000-0000-000000000016', 'Build preliminary travel briefs for next 30-45 days', 'Prepare hotel, field, uniform, and itinerary info for upcoming away events before families ask.', 'Travel & Events', 10),
('c1000000-0000-0000-0000-000000000017', 'Push availability collection ahead of schedule', 'Chase TeamSnap availability responses further out than feels necessary. Use this data for rosters, travel, and staffing.', 'TeamSnap & Volunteers', 10),
('c1000000-0000-0000-0000-000000000018', 'Collect head counts for fall travel and showcase weekends', 'Get firm numbers from families so coaches can plan lineups and staffing for away events.', 'Travel & Events', 10),

-- NOVEMBER (11) — Operate the most change-heavy month cleanly
('c1000000-0000-0000-0000-000000000019', 'Prepare contingency plan for weather and travel disruptions', 'Write a one-page backup plan covering flight disruptions, weather delays, field changes, and late schedule edits.', 'Travel & Events', 11),
('c1000000-0000-0000-0000-000000000020', 'Launch early summer hotel and travel info', 'Publish hotel links and site-map guidance as soon as summer event organizers release booking info.', 'Travel & Events', 11),
('c1000000-0000-0000-0000-000000000021', 'Audit workbook and TeamSnap after every schedule change', 'Every time a field or time changes, update both the workbook and TeamSnap before communicating to families.', 'TeamSnap & Volunteers', 11),
('c1000000-0000-0000-0000-000000000022', 'Coordinate hotel blocks with social chairs', 'Work with social coordinators to keep families in the same hotel blocks for major travel weekends.', 'Travel & Events', 11),
('c1000000-0000-0000-0000-000000000023', 'Send final logistics notes before each travel event', 'Publish venue, arrival time, uniform, weather, and live schedule link for every away event the night before.', 'Communication', 11),

-- DECEMBER (12) — Close the fall season and set up the winter bridge
('c1000000-0000-0000-0000-000000000024', 'Communicate winter training schedule and box programming', 'Publish winter and box training dates before families mentally check out for the holidays.', 'Communication', 12),
('c1000000-0000-0000-0000-000000000025', 'Close out outstanding store orders, replacement gear, and refund requests', 'Resolve all open Lax.com orders, gear corrections, and refund requests before the holiday break.', 'Gear & Uniforms', 12),
('c1000000-0000-0000-0000-000000000026', 'Refresh internal contact list for winter coaches, facilities, and vendors', 'Update the master contact sheet so winter operations have current info for all key parties.', 'Admin', 12),
('c1000000-0000-0000-0000-000000000027', 'Save season-end note on top parent friction points', 'Document what caused the most parent confusion this fall so the next cycle can be tightened.', 'Admin', 12),

-- JANUARY (1) — Bridge from fall operations into spring and summer planning
('c1000000-0000-0000-0000-000000000028', 'Send spring and summer conflict-priority policy reminder', 'Clearly restate the outside lacrosse conflict policy before spring commitments multiply.', 'Communication', 1),
('c1000000-0000-0000-0000-000000000029', 'Send save-the-dates for Memorial Day and major spring events', 'Publish early calendar holds so families can plan travel and budgets before conflicts stack up.', 'Travel & Events', 1),
('c1000000-0000-0000-0000-000000000030', 'Assign social planning owners for major family weekends', 'Confirm which social coordinator is responsible for each major spring event.', 'TeamSnap & Volunteers', 1),
('c1000000-0000-0000-0000-000000000031', 'Begin U10 onboarding communications', 'Start recruiting and onboarding communications for U10 or younger age groups if applicable this cycle.', 'Registration & Tryouts', 1),
('c1000000-0000-0000-0000-000000000032', 'Publish January training blocks and event logistics', 'Communicate indoor, box programming dates and any winter event details clearly and early.', 'Communication', 1),

-- FEBRUARY (2) — Collect the data and bookings that make spring and summer work
('c1000000-0000-0000-0000-000000000033', 'Book fields for late-July tryouts', 'Reserve preferred fields and times for next year''s tryouts. Do not let this slide past February.', 'Facilities', 2),
('c1000000-0000-0000-0000-000000000034', 'Open Lax.com team stores (February window)', 'Launch February store window. Confirm every team has correct store links and purchase instructions in all communications.', 'Gear & Uniforms', 2),
('c1000000-0000-0000-0000-000000000035', 'Send spring and summer availability deadline reminder', 'Chase TeamSnap availability responses until the data is usable for roster and travel planning.', 'TeamSnap & Volunteers', 2),
('c1000000-0000-0000-0000-000000000036', 'Launch U10 onboarding flow', 'Send invitations, set up TeamSnap, schedule kickoff meeting, and collect roster-card corrections for new U10 families.', 'Registration & Tryouts', 2),
('c1000000-0000-0000-0000-000000000037', 'Push high school summer hotel block bookings', 'Open summer hotel links early so HS families can stay together and avoid last-minute pricing.', 'Travel & Events', 2),
('c1000000-0000-0000-0000-000000000038', 'Lock next year''s tryout field reservations', 'Store contracts, dates, and cancellation terms in the control sheet after fields are confirmed.', 'Facilities', 2),
('c1000000-0000-0000-0000-000000000039', 'Recruit or confirm social chairs for new age-group teams', 'Identify volunteer social coordinators for any teams that are new or need a replacement this season.', 'TeamSnap & Volunteers', 2),

-- MARCH (3) — Relaunch the spring season with a steady weekly rhythm
('c1000000-0000-0000-0000-000000000040', 'Confirm first two spring practice weeks before announcing', 'Verify practice times, locations, and coach assignments before communicating to families.', 'Scheduling', 3),
('c1000000-0000-0000-0000-000000000041', 'Send first spring weekly update', 'Relaunch the weekly email rhythm using the same format that worked in the fall.', 'Communication', 3),
('c1000000-0000-0000-0000-000000000042', 'Ensure TeamSnap reflects all spring practices and games', 'Confirm TeamSnap coordinators have all spring events entered with correct times and locations.', 'TeamSnap & Volunteers', 3),
('c1000000-0000-0000-0000-000000000043', 'Create spring event sheet', 'Build one reference document per event: date, arrival plan, attire, ticketing link, and social chair owner.', 'Travel & Events', 3),

-- APRIL (4) — Blend practice operations with family events and spring competition
('c1000000-0000-0000-0000-000000000044', 'Announce tryouts on social media', 'Launch tryout announcement on social media simultaneously with the league app registration link.', 'Registration & Tryouts', 4),
('c1000000-0000-0000-0000-000000000045', 'Publish tryout registration link in league apps', 'Audit every registration link in league apps before the social announcement goes live.', 'Registration & Tryouts', 4),
('c1000000-0000-0000-0000-000000000046', 'Publish next year''s season plan', 'Release the following year''s season-plan snapshot alongside the tryout announcement so families can plan before registering.', 'Communication', 4),
('c1000000-0000-0000-0000-000000000047', 'Open Lax.com team stores (April window)', 'Launch April store window. Include store links in the same communication package as the tryout announcement.', 'Gear & Uniforms', 4),
('c1000000-0000-0000-0000-000000000048', 'Issue event briefs for all special April activities', 'Send one event brief per special April event: arrival time, tickets, team attire, and social plan.', 'Travel & Events', 4),

-- MAY (5) — Run Memorial Day and late-spring travel as project management
('c1000000-0000-0000-0000-000000000049', 'Place tryout supply order', 'Order pinnies, check-in materials, and evaluation supplies. Must be placed no later than two months before late-July tryouts.', 'Registration & Tryouts', 5),
('c1000000-0000-0000-0000-000000000050', 'Confirm vendor lead times and field permits for tryouts', 'Verify all supply vendors, field permits, staffing plans, and rain or overflow contingencies are in place.', 'Registration & Tryouts', 5),
('c1000000-0000-0000-0000-000000000051', 'Maintain master travel brief per team for Memorial Day weekend', 'Build and distribute the full brief: hotel, field, uniform, itinerary, and emergency contacts for each team.', 'Travel & Events', 5),
('c1000000-0000-0000-0000-000000000052', 'Send save-the-date, booking reminder, and final logistics note for each May away event', 'Three-part communication sequence for every away event: save-the-date early, booking reminder mid-cycle, final logistics the week before.', 'Communication', 5),

-- JUNE (6) — Operate the high school summer recruiting window
('c1000000-0000-0000-0000-000000000053', 'Open summer event dashboard for high school travel', 'Build and maintain one tracker for HS travel status, schedule links, hotel booking deadlines, and final rosters.', 'Travel & Events', 6),
('c1000000-0000-0000-0000-000000000054', 'Confirm all summer booking links, expiration dates, and roster assumptions', 'Audit every hotel link, event registration, and team roster before the summer event window opens.', 'Travel & Events', 6),
('c1000000-0000-0000-0000-000000000055', 'Coordinate with coaches on lineup and travel-count decisions', 'Establish the timeline for when lineup and roster decisions become final for summer events.', 'Scheduling', 6),
('c1000000-0000-0000-0000-000000000056', 'Review tryout registrations weekly and push reminders', 'Check registration numbers every week and send reminder posts and emails until numbers stabilize.', 'Registration & Tryouts', 6),

-- JULY (7) — Close the year and set the next cycle up for a cleaner launch
('c1000000-0000-0000-0000-000000000057', 'Run late-July tryouts', 'Execute check-in flow, pinnie control, evaluator support, and communication timing for roster decisions.', 'Registration & Tryouts', 7),
('c1000000-0000-0000-0000-000000000058', 'Submit post-tryout equipment order within 1 week', 'Order helmets, gloves, jerseys, bags, and equipment for all accepted players. Reconcile against the accepted roster before submitting.', 'Gear & Uniforms', 7),
('c1000000-0000-0000-0000-000000000059', 'Archive the season', 'Save final versions of schedules, hotel links, email templates, contact lists, and lessons learned for next year.', 'Admin', 7),
('c1000000-0000-0000-0000-000000000060', 'Create post-season debrief with coaches and volunteers', 'Capture what worked, what broke, and what deadlines or processes should change next cycle.', 'Admin', 7),
('c1000000-0000-0000-0000-000000000061', 'Update SOP with what changed this year', 'Revise the operating playbook to reflect this year''s actual schedule, vendors, and lessons.', 'Admin', 7),
('c1000000-0000-0000-0000-000000000062', 'Write parent FAQ summary', 'Summarize the top questions and confusion points from this season in one document for future reference.', 'Admin', 7),
('c1000000-0000-0000-0000-000000000063', 'Draft first August preseason message', 'Write the preseason welcome email for next season before details from this year fade.', 'Communication', 7)

on conflict (id) do nothing;
