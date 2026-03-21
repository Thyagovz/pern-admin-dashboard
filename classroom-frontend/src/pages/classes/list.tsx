import {useMemo, useState} from 'react'
import {ListView} from "@/components/refine-ui/views/list-view.tsx";
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Search} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {useTable} from "@refinedev/react-table";
import {ClassDetails, Subject, User} from "@/types";
import {Badge} from "@/components/ui/badge.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useList} from "@refinedev/core";
import {ShowButton} from "@/components/refine-ui/buttons/show.tsx";


const ClassesList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [selectedTeacher, setSelectedTeacher] = useState("all");

    const subjectFilters = selectedSubject === "all" ? [] : [
        {field: "subject", operator: "eq" as const, value: selectedSubject},
    ];

    const teacherFilters = selectedTeacher === "all" ? [] : [
        {field: "teacher", operator: "eq" as const, value: selectedTeacher},
    ];

    const searchFilters = searchQuery ? [
        {
            field: "name",
            operator: "contains" as const,
            value: searchQuery
        }
    ] : [];

    const {query: subjectsQuery} = useList<Subject>({
        resource: "subjects",
        pagination: {
            pageSize: 100,
        }
    });

    const {query: teachersQuery} = useList<User>({
        resource: "users",
        filters: [{
            field: "role", operator: "eq", value: "teacher"
        }],
        pagination: {
            pageSize: 100,
        }
    });

    const subjects = subjectsQuery?.data?.data || [];
    const teachers = teachersQuery?.data?.data || [];

    const classTable = useTable<ClassDetails>({
        columns: useMemo<ColumnDef<ClassDetails>[]>(() => [
            {
                id: "bannerUrl",
                accessorKey: "bannerUrl",
                size: 80,
                header: () => <p className="column-title ml-2">Banner</p>,
                cell: ({getValue}) => (
                    <div className="ml-2">
                        <img
                            src={getValue<string>() || "/placeholder-banner.png"}
                            alt="Class Banner"
                            className="w-12 h-12 rounded object-cover border border-border"
                        />
                    </div>
                )
            },
            {
                id: "name",
                accessorKey: "name",
                size: 200,
                header: () => <p className="column-title ">Class Name</p>,
                cell: ({getValue}) => <span className="text-foreground font-medium">{getValue<string>()}</span>,
            },
            {
                id: "status",
                accessorKey: "status",
                size: 100,
                header: () => <p className="column-title ">Status</p>,
                cell: ({getValue}) => {
                    const status = getValue<string>();
                    return (
                        <Badge variant={status === "active" ? "default" : "secondary"}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                    )
                }
            },
            {
                id: "subject",
                accessorKey: "subject.name",
                size: 150,
                header: () => <p className="column-title ">Subject</p>,
                cell: ({getValue}) => <span>{getValue<string>()}</span>
            },
            {
                id: "teacher",
                accessorKey: "teacher.name",
                size: 150,
                header: () => <p className="column-title ">Teacher</p>,
                cell: ({getValue}) => <span>{getValue<string>()}</span>
            },
            {
                id: "capacity",
                accessorKey: "capacity",
                size: 100,
                header: () => <p className="column-title ">Capacity</p>,
                cell: ({getValue}) => <span>{getValue<number>()}</span>
            },
            {
                id: "details",
                size: 140,
                header: () => <p className="column-title ">Details</p>,
                cell: ({row}) => <ShowButton resource="classes" recordItemId={row.original.id} variant="outline"
                                             size="sm">View </ShowButton>


            }
        ], []),
        refineCoreProps: {
            resource: "classes",
            pagination: {pageSize: 10, mode: "server"},
            filters: {
                permanent: [...subjectFilters, ...teacherFilters, ...searchFilters]
            },
            sorters: {
                initial: [
                    {
                        field: "createdAt",
                        order: "desc"
                    }
                ]
            },
        }

    });

    return (
        <ListView>
            <Breadcrumb/>

            <h1 className="page-title">Classes</h1>

            <div className="intro-row">
                <p>Manage and browse through all available classes.</p>


                <div className="actions-row flex flex-col md:flex-row gap-4">
                    <div className="search-field flex-1">
                        <Search className="search-icon"/>

                        <Input
                            type="text"
                            placeholder="Search by name..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by subject"/>
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">
                                    All Subjects
                                </SelectItem>
                                {subjects.map(subject => (
                                    <SelectItem key={subject.id}
                                                value={subject.name}>
                                        {subject.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by teacher"/>
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">
                                    All Teachers
                                </SelectItem>
                                {teachers.map(teacher => (
                                    <SelectItem key={teacher.id}
                                                value={teacher.name}>
                                        {teacher.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <CreateButton resource="classes"/>
                    </div>
                </div>
            </div>

            <DataTable table={classTable}/>
        </ListView>
    )
}

export default ClassesList
