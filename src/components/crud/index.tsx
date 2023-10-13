"use client"
import axios from "axios";
import React, { useEffect, useState } from "react";

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
    <div className="flex flex-col justify-start items-start gap-3">
      {projects.length > 0 && (
        <div className="">
            <h2>Project list</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th>id</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => {
                return (
                  <tr key={`pr_${index}`} className="text-center border">
                    <td>{project.project_id}</td>
                    <td>{project.project_name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {tasks.length > 0 && (
        <div className="w-full">
            <h2>Tasks list</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Project Id</th>
                <th>Commencement</th>
                <th>Conclusion</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {
                tasks.map((task, index) => {
                  return <tr key={`tsk_${index}`} className="text-center border">
                    <td>{task.task_id}</td>
                    <td>{task.task_name}</td>
                    <td>{task.project_id}</td>
                    <td>{task.commencement_date}</td>
                    <td>{task.conclusion_date}</td>
                    <td>{task.duration}</td>
                  </tr>
                })
              }
            </tbody>
          </table>
        </div>
      )}
      {
        assignments.length > 0 && (
          <div className="">
            <h2>Assignment list</h2>
            <table className="">
              <thead>
                <tr>
                  <th>Task Id</th>
                  <th>Name</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {
                  assignments.map((assignment, index) => {
                    return <tr key={index} className="text-center border">
                      <td>{assignment.task_id}</td>
                      <td>{assignment.resource_name}</td>
                      <td>{assignment.assignment_duration}</td>
                    </tr>
                  })
                }
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  );
};

export default Crud;
