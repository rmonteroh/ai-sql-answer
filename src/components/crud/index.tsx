"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type Project = {
  project_id: number;
  project_name: string;
};

type Tasks = {
  task_id: number;
  task_name: string;
  project_id: number;
  commencement_date: string;
  conclusion_date: string;
  duration: number;
};

type Assignment = {
  assignment_id: number;
  task_id: number;
  resource_name: string;
  assignment_duration: number;
};

const Crud = (props: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const handleGetProjects = async () => {
    try {
      const { data } = await axios.get("/api/projects");
      setProjects(data);
      console.log("data", data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetTasks = async () => {
    try {
      const { data } = await axios.get("/api/tasks");
      setTasks(data);
      console.log("data", data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetAssignments = async () => {
    try {
      const { data } = await axios.get("/api/resource");
      setAssignments(data);
      console.log("data", data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetProjects();
    handleGetTasks();
    handleGetAssignments();
  }, []);
  return (
    <div className="flex flex-col justify-center items-start gap-6 divide-y-2">
      {projects.length > 0 && (
        <div className="w-full p-8 shadow-xl mb-4">
          <h2 className="text-2xl font-medium">Project list</h2>
          <Table className="">
            <TableCaption>A list of your projects</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>id</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project, index) => (
                <TableRow key={`pr_${index}`}>
                  <TableCell className="font-medium">
                    {project.project_id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {project.project_name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {tasks.length > 0 && (
        <div className="w-full p-8 shadow-xl mb-4">
          <h2 className="text-2xl font-medium">Tasks list</h2>
          <Table className="w-full">
          <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Commencement</TableHead>
                <TableHead>Conclusion</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task, index) => (
                <TableRow key={`tsk_${index}`}>
                  <TableCell>{task.task_id}</TableCell>
                    <TableCell>{task.task_name}</TableCell>
                    <TableCell>{projects[task.project_id - 1].project_name}</TableCell>
                    <TableCell>{task.commencement_date}</TableCell>
                    <TableCell>{task.conclusion_date}</TableCell>
                    <TableCell>{task.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {assignments.length > 0 && (
        <div className="w-full  p-8 shadow-xl mb-4">
          <h2 className="text-2xl font-medium">Assignment list</h2>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment, index) => {
                return (
                  <TableRow key={index} >
                    <TableCell>{tasks[assignment.task_id - 1].task_name}</TableCell>
                    <TableCell>{assignment.resource_name}</TableCell>
                    <TableCell>{assignment.assignment_duration}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Crud;
