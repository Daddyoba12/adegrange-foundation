-- ============================================================
-- AdeGrange Foundation — Programs Table Migration
-- Run this ONCE in your Supabase SQL Editor:
-- https://app.supabase.com → your project → SQL Editor
-- ============================================================

-- Step 1: Add new columns to the programs table
ALTER TABLE programs ADD COLUMN IF NOT EXISTS year             text;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS location         text;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS beneficiaries    text;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS full_description text;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS impact           text[];

-- Step 2: Seed the 5 existing programs (safe — only inserts if slug doesn't exist yet)

INSERT INTO programs (title, slug, description, year, location, beneficiaries, full_description, impact)
SELECT
  '2017 Partnership - Full Life Nursery & Primary School',
  '2017-full-life-nursery',
  'Supporting early childhood education through community partnership and engagement.',
  '2017',
  'Nigeria',
  '150+ children',
  'The Full Life Nursery & Primary School partnership represents our commitment to early childhood development and educational excellence. Through community engagement and sustainable support, we''ve helped establish a foundation for quality education that serves hundreds of children annually.',
  ARRAY[
    'Provided educational materials and supplies',
    'Enhanced classroom facilities',
    'Supported teacher training programs',
    'Established sustainable community engagement model'
  ]
WHERE NOT EXISTS (SELECT 1 FROM programs WHERE slug = '2017-full-life-nursery');

UPDATE programs SET
  year = '2017', location = 'Nigeria', beneficiaries = '150+ children',
  full_description = 'The Full Life Nursery & Primary School partnership represents our commitment to early childhood development and educational excellence. Through community engagement and sustainable support, we''ve helped establish a foundation for quality education that serves hundreds of children annually.',
  impact = ARRAY['Provided educational materials and supplies','Enhanced classroom facilities','Supported teacher training programs','Established sustainable community engagement model']
WHERE slug = '2017-full-life-nursery' AND (year IS NULL OR year = '');

-- ----

INSERT INTO programs (title, slug, description, year, location, beneficiaries, full_description, impact)
SELECT
  '2018 Partnership - Young Shapers Club',
  '2018-young-shapers-club',
  'Empowering youth leadership and structured development through mentorship initiatives.',
  '2018',
  'Nigeria',
  '200+ youth',
  'The Young Shapers Club partnership focuses on empowering displaced youth through structured leadership development and educational support. This program provides mentorship, educational resources, and leadership training to build resilient communities.',
  ARRAY[
    'Financed IDP children''s education',
    'Established youth leadership programs',
    'Provided mentorship opportunities',
    'Created sustainable development pathways'
  ]
WHERE NOT EXISTS (SELECT 1 FROM programs WHERE slug = '2018-young-shapers-club');

UPDATE programs SET
  year = '2018', location = 'Nigeria', beneficiaries = '200+ youth',
  full_description = 'The Young Shapers Club partnership focuses on empowering displaced youth through structured leadership development and educational support. This program provides mentorship, educational resources, and leadership training to build resilient communities.',
  impact = ARRAY['Financed IDP children''s education','Established youth leadership programs','Provided mentorship opportunities','Created sustainable development pathways']
WHERE slug = '2018-young-shapers-club' AND (year IS NULL OR year = '');

-- ----

INSERT INTO programs (title, slug, description, year, location, beneficiaries, full_description, impact)
SELECT
  'Summer 2017 - Peer-to-Peer Dialogue Program',
  '2017-peer-to-peer',
  'Promoting cross-community dialogue and youth participation in leadership development.',
  '2017',
  'Nigeria',
  '100+ youth',
  'Our Peer-to-Peer Dialogue Program brings together youth from diverse backgrounds to foster understanding, build leadership skills, and promote peaceful coexistence. Through structured dialogue sessions and collaborative activities, participants develop critical thinking and conflict resolution skills.',
  ARRAY[
    'Facilitated cross-community dialogue sessions',
    'Trained youth leaders in conflict resolution',
    'Built sustainable peace-building networks',
    'Documented best practices for youth engagement'
  ]
WHERE NOT EXISTS (SELECT 1 FROM programs WHERE slug = '2017-peer-to-peer');

UPDATE programs SET
  year = '2017', location = 'Nigeria', beneficiaries = '100+ youth',
  full_description = 'Our Peer-to-Peer Dialogue Program brings together youth from diverse backgrounds to foster understanding, build leadership skills, and promote peaceful coexistence. Through structured dialogue sessions and collaborative activities, participants develop critical thinking and conflict resolution skills.',
  impact = ARRAY['Facilitated cross-community dialogue sessions','Trained youth leaders in conflict resolution','Built sustainable peace-building networks','Documented best practices for youth engagement']
WHERE slug = '2017-peer-to-peer' AND (year IS NULL OR year = '');

-- ----

INSERT INTO programs (title, slug, description, year, location, beneficiaries, full_description, impact)
SELECT
  'Summer 2019 - Girls Health Matter',
  '2019-girls-health-matter',
  'Advancing adolescent health awareness and educational support for girls.',
  '2019',
  'Kubwa & Byazin, Nigeria',
  '300+ girls',
  'The Girls Health Matter program addresses critical gaps in adolescent health education and support. Through school-based interventions, we provide girls with essential knowledge, resources, and support systems to make informed decisions about their health and well-being.',
  ARRAY[
    'Conducted health awareness workshops',
    'Distributed hygiene and health supplies',
    'Established school health clubs',
    'Created sustainable support networks'
  ]
WHERE NOT EXISTS (SELECT 1 FROM programs WHERE slug = '2019-girls-health-matter');

UPDATE programs SET
  year = '2019', location = 'Kubwa & Byazin, Nigeria', beneficiaries = '300+ girls',
  full_description = 'The Girls Health Matter program addresses critical gaps in adolescent health education and support. Through school-based interventions, we provide girls with essential knowledge, resources, and support systems to make informed decisions about their health and well-being.',
  impact = ARRAY['Conducted health awareness workshops','Distributed hygiene and health supplies','Established school health clubs','Created sustainable support networks']
WHERE slug = '2019-girls-health-matter' AND (year IS NULL OR year = '');

-- ----

INSERT INTO programs (title, slug, description, year, location, beneficiaries, full_description, impact)
SELECT
  '2019 Feeding Project - Chicago, Illinois',
  '2019-feeding-project',
  'International outreach initiative supporting families through structured feeding and welfare services.',
  '2019',
  'Chicago, Illinois, USA',
  '500+ families',
  'Our Chicago Feeding Project extends our mission internationally, addressing food insecurity among vulnerable families. Through partnerships with local organizations, we provide nutritious meals and connect families with long-term support services.',
  ARRAY[
    'Provided nutritious meals to families in need',
    'Connected families with social services',
    'Built international partnership networks',
    'Established replicable feeding program model'
  ]
WHERE NOT EXISTS (SELECT 1 FROM programs WHERE slug = '2019-feeding-project');

UPDATE programs SET
  year = '2019', location = 'Chicago, Illinois, USA', beneficiaries = '500+ families',
  full_description = 'Our Chicago Feeding Project extends our mission internationally, addressing food insecurity among vulnerable families. Through partnerships with local organizations, we provide nutritious meals and connect families with long-term support services.',
  impact = ARRAY['Provided nutritious meals to families in need','Connected families with social services','Built international partnership networks','Established replicable feeding program model']
WHERE slug = '2019-feeding-project' AND (year IS NULL OR year = '');
