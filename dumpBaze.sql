--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2024-10-27 19:49:59

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4791 (class 0 OID 33359)
-- Dependencies: 216
-- Data for Name: hotel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hotel (hotel_id, imehotela, ulica, kucnibroj, postanskibroj, grad, drzava, brojzvjezdica, telefon, email) FROM stdin;
1	Hotel Dubrovnik	Ljudevita Gaja	1	10000	Zagreb	Hrvatska	4	+38514863512	info@hotel-dubrovnik.hr
2	Admiral Hotel	Rudeška Cesta	140	10000	Zagreb	Hrvatska	4	+38513322900	info@admiralhotel.hr
3	The Westin Zagreb	Krsnjavoga	1	10000	Zagreb	Hrvatska	5	+38552808896	westin.zagreb@westinzagreb.com
4	Hotel Osijek	Šamačka	4	31000	Osijek	Hrvatska	4	+38531230333	info@hotelosijek.hr
5	Hotel Waldinger	Županijska ulica	8	31000	Osijek	Hrvatska	4	+38531250450	info@waldinger.hr
6	Hotel Olympia	Ljudevita Gaja	6	22211	Vodice	Hrvatska	4	+38522452452	recepcija@olympiavodice.hr
7	Hotel Olympia Sky	Ljudevita Gaja	6	22211	Vodice	Hrvatska	4	+38522452452	recepcija@olympiavodice.hr
8	Hotel International	Miramarska	24	10000	Zagreb	Hrvatska	4	+38552808800	hello@maistra.hr
9	Hotel Split Inn by President	4. Gardijske Brigade	55	21000	Split	Hrvatska	4	+38521444230	splitinn@hotelpresident.hr
10	Hotel Luxe Split	Ul.kralja Zvonimira	6	21000	Split	Hrvatska	4	+38521314444	reservations@hotelluxesplit.com
\.


--
-- TOC entry 4793 (class 0 OID 33367)
-- Dependencies: 218
-- Data for Name: sobe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sobe (soba_id, hotel_id, brojosoba, cijena) FROM stdin;
1	1	Jedna osoba	139.91
2	1	Dvije osobe	172.74
3	2	Jedna osoba	121.59
4	2	Dvije osobe	123.18
5	3	Jedna osoba	129.00
6	3	Dvije osobe	129.00
7	4	Jedna osoba	119.46
8	4	Dvije osobe	178.92
9	5	Jedna osoba	121.08
10	5	Dvije osobe	145.00
11	6	Jedna osoba	100.80
12	6	Dvije osobe	174.60
13	7	Jedna osoba	118.59
14	7	Dvije osobe	136.00
15	8	Jedna osoba	156.80
16	8	Dvije osobe	156.80
17	9	Jedna osoba	113.86
18	9	Dvije osobe	147.72
19	10	Jedna osoba	126.86
20	10	Dvije osobe	153.72
\.


--
-- TOC entry 4801 (class 0 OID 0)
-- Dependencies: 215
-- Name: hotel_hotel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hotel_hotel_id_seq', 10, true);


--
-- TOC entry 4802 (class 0 OID 0)
-- Dependencies: 217
-- Name: sobe_soba_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sobe_soba_id_seq', 20, true);


-- Completed on 2024-10-27 19:49:59

--
-- PostgreSQL database dump complete
--

