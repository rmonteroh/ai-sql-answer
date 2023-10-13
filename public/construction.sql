-- Create Projects table
CREATE TABLE projects (
    project_id INT PRIMARY KEY,
    project_name VARCHAR(100)
);

-- Create Tasks table
CREATE TABLE tasks (
    task_id INT PRIMARY KEY,
    task_name VARCHAR(100),
    project_id INT,
    commencement_date DATE,
    conclusion_date DATE,
    duration INT,
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

-- Create Logic table
CREATE TABLE logic (
    logic_id INT PRIMARY KEY,
    prerequisite_task_id INT,
    dependent_task_id INT,
    FOREIGN KEY (prerequisite_task_id) REFERENCES tasks(task_id),
    FOREIGN KEY (dependent_task_id) REFERENCES tasks(task_id)
);

-- Create Resource Assignments table
CREATE TABLE resource_assignments (
    assignment_id INT PRIMARY KEY,
    task_id INT,
    resource_name VARCHAR(100),
    assignment_duration INT,
    FOREIGN KEY (task_id) REFERENCES tasks(task_id)
);

-- Insert 10 construction-related projects with 4 tasks each
INSERT INTO projects (project_id, project_name)
VALUES
    (1, 'High-rise Building Construction Project'),
    (2, 'Residential Complex Construction Project'),
    (3, 'Bridge Construction Project'),
    (4, 'Shopping Mall Construction Project'),
    (5, 'Hospital Construction Project'),
    (6, 'School Building Construction Project'),
    (7, 'Office Tower Construction Project'),
    (8, 'Sports Arena Construction Project'),
    (9, 'Road Infrastructure Construction Project'),
    (10, 'Hotel Construction Project');

-- Insert tasks for Project 1
INSERT INTO tasks (task_id, task_name, project_id, commencement_date, conclusion_date, duration)
VALUES
    (1, 'Excavation', 1, '2023-10-11', '2023-10-14', 3),
    (2, 'Foundation Construction', 1, '2023-10-18', '2023-10-21', 3),
    (3, 'Wall Construction', 1, '2023-10-25', '2023-10-28', 3),
    (4, 'Roof Installation', 1, '2023-11-01', '2023-11-04', 3);

-- Insert tasks for Project 2
INSERT INTO tasks (task_id, task_name, project_id, commencement_date, conclusion_date, duration)
VALUES
    (5, 'Site Preparation', 2, '2023-10-12', '2023-10-15', 3),
    (6, 'Structural Framing', 2, '2023-10-20', '2023-10-23', 3),
    (7, 'Interior Finishing', 2, '2023-10-27', '2023-10-30', 3),
    (8, 'Landscaping', 2, '2023-11-03', '2023-11-06', 3);

-- Insert tasks for Project 3
INSERT INTO tasks (task_id, task_name, project_id, commencement_date, conclusion_date, duration)
VALUES
    (9, 'Site Survey', 3, '2023-10-13', '2023-10-16', 3),
    (10, 'Foundation Preparation', 3, '2023-10-19', '2023-10-22', 3),
    (11, 'Bridge Pillar Construction', 3, '2023-10-26', '2023-10-29', 3),
    (12, 'Deck Construction', 3, '2023-11-02', '2023-11-05', 3);

-- Insert tasks for Project 4
INSERT INTO tasks (task_id, task_name, project_id, commencement_date, conclusion_date, duration)
VALUES
    (13, 'Blueprint Analysis', 4, '2023-10-14', '2023-10-17', 3),
    (14, 'Structural Engineering', 4, '2023-10-21', '2023-10-24', 3),
    (15, 'Permit Approval', 4, '2023-10-28', '2023-10-31', 3),
    (16, 'Construction Oversight', 4, '2023-11-04', '2023-11-07', 3);

-- Continue this pattern for the remaining projects...
-- Insert tasks for Project 5
INSERT INTO tasks (task_id, task_name, project_id, commencement_date, conclusion_date, duration)
VALUES
    (17, 'Site Clearance', 5, '2023-10-15', '2023-10-18', 3),
    (18, 'Foundation Construction', 5, '2023-10-22', '2023-10-25', 3),
    (19, 'Structural Framing', 5, '2023-10-29', '2023-11-01', 3),
    (20, 'Interior Finishing', 5, '2023-11-05', '2023-11-08', 3);

-- Insert tasks for Project 6
INSERT INTO tasks (task_id, task_name, project_id, commencement_date, conclusion_date, duration)
VALUES
    (21, 'Land Acquisition', 6, '2023-10-16', '2023-10-19', 3),
    (22, 'Architectural Design', 6, '2023-10-23', '2023-10-26', 3),
    (23, 'Foundation Construction', 6, '2023-10-30', '2023-11-02', 3),
    (24, 'Roof Installation', 6, '2023-11-06', '2023-11-09', 3);

-- Insert tasks for Project 7
INSERT INTO tasks (task_id, task_name, project_id, commencement_date, conclusion_date, duration)
VALUES
    (25, 'Permit Processing', 7, '2023-10-17', '2023-10-20', 3),
    (26, 'Site Preparation', 7, '2023-10-24', '2023-10-27', 3),
    (27, 'Structural Framing', 7, '2023-10-31', '2023-11-03', 3),
    (28, 'Interior Finishing', 7, '2023-11-07', '2023-11-10', 3);

-- Insert tasks for Project 8
INSERT INTO tasks (task_id, task_name, project_id, commencement_date, conclusion_date, duration)
VALUES
    (29, 'Site Survey', 8, '2023-10-18', '2023-10-21', 3),
    (30, 'Foundation Construction', 8, '2023-10-25', '2023-10-28', 3),
    (31, 'Structural Framing', 8, '2023-11-01', '2023-11-04', 3),
    (32, 'Roof Installation', 8, '2023-11-08', '2023-11-11', 3);

-- Insert tasks for Project 9
INSERT INTO tasks (task_id, task_name, project_id, commencement_date, conclusion_date, duration)
VALUES
    (33, 'Permit Approval', 9, '2023-10-19', '2023-10-22', 3),
    (34, 'Site Preparation', 9, '2023-10-26', '2023-10-29', 3),
    (35, 'Road Foundation Construction', 9, '2023-11-02', '2023-11-05', 3),
    (36, 'Asphalt Paving', 9, '2023-11-09', '2023-11-12', 3);

-- Insert tasks for Project 10
INSERT INTO tasks (task_id, task_name, project_id, commencement_date, conclusion_date, duration)
VALUES
    (37, 'Land Survey', 10, '2023-10-20', '2023-10-23', 3),
    (38, 'Foundation Construction', 10, '2023-10-27', '2023-10-30', 3),
    (39, 'Structural Framing', 10, '2023-11-03', '2023-11-06', 3),
    (40, 'Exterior Finishing', 10, '2023-11-10', '2023-11-13', 3);

-- Insert task interdependencies (logic)
INSERT INTO logic (logic_id, prerequisite_task_id, dependent_task_id)
VALUES
    (1, 1, 2),
    (2, 2, 3),
    (3, 3, 4),
    (4, 5, 6),
    (5, 6, 7),
    (6, 7, 8),
    (7, 9, 10),
    (8, 10, 11),
    (9, 11, 12),
    (10, 13, 14),
    (11, 14, 15),
    (12, 15, 16),
    (13, 17, 18),
    (14, 18, 19),
    (15, 19, 20),
    (16, 21, 22),
    (17, 22, 23),
    (18, 23, 24),
    (19, 25, 26),
    (20, 26, 27),
    (21, 27, 28),
    (22, 29, 30),
    (23, 30, 31),
    (24, 31, 32),
    (25, 33, 34),
    (26, 34, 35),
    (27, 35, 36),
    (28, 37, 38),
    (29, 38, 39),
    (30, 39, 40);

    -- Insert resource assignments for Project 1 tasks
INSERT INTO resource_assignments (assignment_id, task_id, resource_name, assignment_duration)
VALUES
    (1, 1, 'Excavator Operator', 2),
    (2, 2, 'Construction Worker', 2),
    (3, 3, 'Bricklayer', 2),
    (4, 4, 'Roofing Contractor', 2);

-- Insert resource assignments for Project 2 tasks
INSERT INTO resource_assignments (assignment_id, task_id, resource_name, assignment_duration)
VALUES
    (5, 5, 'Site Engineer', 2),
    (6, 6, 'Carpenter', 2),
    (7, 7, 'Plumber', 2),
    (8, 8, 'Landscaper', 2);

-- Insert resource assignments for Project 3 tasks
INSERT INTO resource_assignments (assignment_id, task_id, resource_name, assignment_duration)
VALUES
    (9, 9, 'Surveyor', 2),
    (10, 10, 'Concrete Mixer Operator', 2),
    (11, 11, 'Steelworker', 2),
    (12, 12, 'Decking Installer', 2);

-- Insert resource assignments for Project 4 tasks
INSERT INTO resource_assignments (assignment_id, task_id, resource_name, assignment_duration)
VALUES
    (13, 13, 'Architect', 2),
    (14, 14, 'Structural Engineer', 2),
    (15, 15, 'Permit Officer', 2),
    (16, 16, 'Construction Supervisor', 2);

-- Continue this pattern for the remaining projects...

-- Insert resource assignments for Project 5 tasks
INSERT INTO resource_assignments (assignment_id, task_id, resource_name, assignment_duration)
VALUES
    (17, 17, 'Excavator Operator', 2),
    (18, 18, 'Construction Worker', 2),
    (19, 19, 'Carpenter', 2),
    (20, 20, 'Painter', 2);

-- Insert resource assignments for Project 6 tasks
INSERT INTO resource_assignments (assignment_id, task_id, resource_name, assignment_duration)
VALUES
    (21, 21, 'Architect', 2),
    (22, 22, 'Interior Designer', 2),
    (23, 23, 'Construction Worker', 2),
    (24, 24, 'Roofing Contractor', 2);

-- Insert resource assignments for Project 7 tasks
INSERT INTO resource_assignments (assignment_id, task_id, resource_name, assignment_duration)
VALUES
    (25, 25, 'Permit Officer', 2),
    (26, 26, 'Site Engineer', 2),
    (27, 27, 'Plumber', 2),
    (28, 28, 'Electrician', 2);

-- Insert resource assignments for Project 8 tasks
INSERT INTO resource_assignments (assignment_id, task_id, resource_name, assignment_duration)
VALUES
    (29, 29, 'Surveyor', 2),
    (30, 30, 'Concrete Mixer Operator', 2),
    (31, 31, 'Carpenter', 2),
    (32, 32, 'Window Installer', 2);

-- Insert resource assignments for Project 9 tasks
INSERT INTO resource_assignments (assignment_id, task_id, resource_name, assignment_duration)
VALUES
    (33, 33, 'Architect', 2),
    (34, 34, 'Construction Worker', 2),
    (35, 35, 'Asphalt Paving Operator', 2),
    (36, 36, 'Traffic Management Officer', 2);

-- Insert resource assignments for Project 10 tasks
INSERT INTO resource_assignments (assignment_id, task_id, resource_name, assignment_duration)
VALUES
    (37, 37, 'Surveyor', 2),
    (38, 38, 'Concrete Mixer Operator', 2),
    (39, 39, 'Carpenter', 2),
    (40, 40, 'Exterior Finisher', 2);
