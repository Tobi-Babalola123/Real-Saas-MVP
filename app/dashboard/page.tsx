"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";
import Link from "next/link";
import Papa from "papaparse";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function DashboardPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  //   const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [groupedLeads, setGroupedLeads] = useState({
    new: [],
    contacted: [],
    qualified: [],
    proposal_sent: [],
    won: [],
    lost: [],
  });
  const [followupLoading, setFollowupLoading] = useState(false);
  const [followupResult, setFollowupResult] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/login";
      }
    };

    checkUser();
    fetchLeads();
    fetchTeamMembers();
    fetchCurrentUser();

    const channel = supabase
      .channel("realtime-waitlist")

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "waitlist",
        },
        (payload) => {
          console.log("Realtime update:", payload);

          // Refetch instantly
          fetchLeads();
        },
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchActivities = async (leadId: number) => {
    const { data } = await supabase
      .from("lead_activities")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", {
        ascending: false,
      });

    if (data) {
      setActivities(data);
    }
  };

  const fetchTeamMembers = async () => {
    const { data } = await supabase.from("profiles").select("*");

    if (data) {
      setTeamMembers(data);
    }
  };

  const fetchCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setCurrentUser(data);
    }
  };

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from("waitlist")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      let filteredData = data;

      // ROLE FILTERING
      if (currentUser?.role === "sales_rep") {
        filteredData = data.filter(
          (lead) => lead.assigned_to === currentUser.id || !lead.assigned_to,
        );
      }

      // STORE LEADS
      setLeads(filteredData);

      const grouped = {
        new: [],
        contacted: [],
        qualified: [],
        proposal_sent: [],
        won: [],
        lost: [],
      };

      filteredData.forEach((lead) => {
        // AUTO LEAD SCORING
        let score = "cold";

        if (lead.company_name && lead.company_name.length > 5) {
          score = "warm";
        }

        if (
          lead.status === "qualified" ||
          lead.status === "proposal_sent" ||
          lead.status === "won"
        ) {
          score = "hot";
        }

        lead.lead_score = score;

        const status = (lead.status || "new").toString().trim().toLowerCase();

        if (grouped[status]) {
          grouped[status].push(lead);
        } else {
          grouped.new.push(lead);
        }
      });

      setGroupedLeads(grouped);
    }

    setLoading(false);
    let filteredData = data;

    if (currentUser?.role === "sales_rep") {
      filteredData = data.filter(
        (lead) => lead.assigned_to === currentUser.id || !lead.assigned_to,
      );
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(
      (lead) =>
        lead.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        lead.email?.toLowerCase().includes(search.toLowerCase()) ||
        lead.company_name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, leads]);

  const chartData = leads.slice(0, 7).map((_, index) => ({
    name: `Lead ${index + 1}`,
    leads: index + 1,
  }));

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/20 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-green-500/10 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <p className="text-primary font-medium mb-2">SolarFlow CRM</p>

            <h1 className="text-5xl font-bold tracking-tight">
              Analytics Dashboard
            </h1>

            <p className="text-gray-400 mt-3">
              Manage and monitor your incoming solar leads.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm backdrop-blur-xl hover:bg-white/[0.06] transition-all">
                ← Back Home
              </button>
            </Link>

            <button
              onClick={() => {
                const csv = Papa.unparse(leads);

                const blob = new Blob([csv], {
                  type: "text/csv;charset=utf-8;",
                });

                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");

                link.href = url;
                link.setAttribute("download", "solarflow-leads.csv");

                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);
              }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm backdrop-blur-xl hover:bg-white/[0.06] transition-all"
            >
              Export CSV
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut();

                window.location.href = "/login";
              }}
              className="
    rounded-2xl
    border
    border-red-500/20
    bg-red-500/10
    px-6
    py-3
    text-sm
    text-red-400
  "
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <p className="text-gray-400 text-sm mb-2">Total Leads</p>
            <h2 className="text-5xl font-bold">{leads.length}</h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <p className="text-gray-400 text-sm mb-2">Companies</p>
            <h2 className="text-5xl font-bold">
              {new Set(leads.map((lead) => lead.company_name)).size}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <p className="text-gray-400 text-sm mb-2">Conversion Rate</p>
            <h2 className="text-5xl font-bold">87%</h2>
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl mb-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Lead Growth</h2>
            <p className="text-gray-400 text-sm mt-1">
              Recent waitlist performance
            </p>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="name" stroke="#666" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#22c55e"
                  fill="#22c55e33"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none backdrop-blur-xl"
          />
        </div>

        {/* Leads Table */}
        {/* CRM Pipeline */}
        <DragDropContext
          onDragEnd={async (result) => {
            if (!result.destination) return;

            const leadId = result.draggableId;
            const newStatus = result.destination.droppableId;

            await supabase
              .from("waitlist")
              .update({
                status: newStatus,
              })
              .eq("id", leadId);

            await supabase.from("lead_activities").insert({
              lead_id: selectedLead.id,
              activity: "Internal note updated",
            });

            fetchActivities(selectedLead.id);

            fetchLeads();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[
              {
                key: "new",
                title: "New Leads",
              },
              {
                key: "contacted",
                title: "Contacted",
              },
              {
                key: "qualified",
                title: "Qualified",
              },
              {
                key: "proposal_sent",
                title: "Proposal Sent",
              },
              {
                key: "won",
                title: "Won",
              },
              {
                key: "lost",
                title: "Lost",
              },
            ].map((column) => (
              <Droppable droppableId={column.key} key={column.key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.03]
              backdrop-blur-2xl
              p-5
              min-h-[500px]
            "
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold">{column.title}</h2>

                      <span
                        className="
                  rounded-full
                  bg-white/10
                  px-3
                  py-1
                  text-xs
                  text-gray-300
                "
                      >
                        {groupedLeads[column.key]?.length || 0}
                      </span>
                    </div>

                    {/* Lead Cards */}
                    <div className="space-y-4">
                      {groupedLeads[column.key]
                        ?.filter((lead) => {
                          return (
                            lead.full_name
                              ?.toLowerCase()
                              .includes(search.toLowerCase()) ||
                            lead.email
                              ?.toLowerCase()
                              .includes(search.toLowerCase()) ||
                            lead.company_name
                              ?.toLowerCase()
                              .includes(search.toLowerCase())
                          );
                        })
                        .map((lead, index) => (
                          <Draggable
                            draggableId={lead.id.toString()}
                            index={index}
                            key={lead.id}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="
                          rounded-2xl
                          border
                          border-white/10
                          bg-black/40
                          p-4
                          hover:bg-white/[0.04]
                          transition-all
                        "
                              >
                                {/* Lead Name */}
                                <h3 className="font-semibold text-lg">
                                  {lead.full_name}
                                </h3>

                                {/* Email */}
                                <p className="text-sm text-gray-400 mt-1">
                                  {lead.email}
                                </p>

                                {/* Company */}
                                <p className="text-sm text-gray-500 mt-1">
                                  {lead.company_name}
                                </p>

                                {lead.assigned_to && (
                                  <div
                                    className="
      mt-2
      text-xs
      text-green-400
    "
                                  >
                                    👤 Assigned
                                  </div>
                                )}

                                {/* Lead Score */}
                                <div className="mt-3">
                                  {lead.lead_score === "hot" && (
                                    <span className="rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs text-red-400">
                                      🔥 Hot Lead
                                    </span>
                                  )}

                                  {lead.lead_score === "warm" && (
                                    <span className="rounded-full bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 text-xs text-yellow-400">
                                      ⚡ Warm Lead
                                    </span>
                                  )}

                                  {lead.lead_score === "cold" && (
                                    <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs text-blue-400">
                                      ❄️ Cold Lead
                                    </span>
                                  )}
                                </div>
                                {/* AI Lead Score */}

                                {lead.follow_up_date &&
                                  new Date(lead.follow_up_date) <
                                    new Date() && (
                                    <div
                                      className="
        mt-3
        rounded-full
        bg-red-500/10
        border
        border-red-500/20
        px-3
        py-1
        text-xs
        text-red-400
        inline-block
      "
                                    >
                                      ⏰ Follow-up overdue
                                    </div>
                                  )}

                                {/* Status */}
                                <div className="mt-5">
                                  <select
                                    value={(lead.status || "new").toLowerCase()}
                                    onChange={async (e) => {
                                      const newStatus = e.target.value;

                                      await supabase
                                        .from("waitlist")
                                        .update({
                                          status: newStatus,
                                        })
                                        .eq("id", lead.id);

                                      await supabase
                                        .from("lead_activities")
                                        .insert({
                                          lead_id: selectedLead.id,
                                          activity: "Internal note updated",
                                        });

                                      fetchActivities(selectedLead.id);

                                      fetchLeads();
                                    }}
                                    className="
                              w-full
                              rounded-xl
                              border
                              border-white/10
                              bg-black
                              px-4
                              py-3
                              text-sm
                              text-white
                              outline-none
                            "
                                  >
                                    <option value="new">New Lead</option>

                                    <option value="contacted">Contacted</option>

                                    <option value="qualified">Qualified</option>

                                    <option value="proposal_sent">
                                      Proposal Sent
                                    </option>

                                    <option value="won">Won</option>

                                    <option value="lost">Lost</option>
                                  </select>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex items-center gap-3 mt-4">
                                  <a
                                    onClick={async () => {
                                      await supabase
                                        .from("lead_activities")
                                        .insert({
                                          lead_id: lead.id,
                                          activity:
                                            "WhatsApp conversation opened",
                                        });
                                    }}
                                    href={`https://wa.me/${
                                      lead.phone || ""
                                    }?text=${encodeURIComponent(
                                      `Hi ${lead.full_name},

Thanks for your interest in SolarFlow.

We'd love to help you with your solar installation needs.`,
                                    )}`}
                                    target="_blank"
                                    className="
                              flex-1
                              rounded-xl
                              bg-green-500/10
                              border
                              border-green-500/20
                              py-2
                              text-center
                              text-sm
                              text-green-400
                              hover:bg-green-500/20
                              transition-all
                            "
                                  >
                                    WhatsApp
                                  </a>

                                  <button
                                    className="
                              flex-1
                              rounded-xl
                              bg-white/5
                              border
                              border-white/10
                              py-2
                              text-sm
                              hover:bg-white/10
                              transition-all
                            "
                                    onClick={() => {
                                      setSelectedLead(lead);
                                      fetchActivities(lead.id);
                                    }}
                                  >
                                    Details
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}

                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
      {selectedLead && (
        <div
          className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/70
      backdrop-blur-sm
      p-6
    "
        >
          <div
            className="
        w-full
        max-w-2xl
        rounded-3xl
        border
        border-white/10
        bg-[#0b0b0b]
        p-8
        max-h-[90vh]
        overflow-y-auto
      "
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">{selectedLead.full_name}</h2>

                <p className="text-gray-400 mt-2">Lead Details</p>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="
            rounded-xl
            bg-white/5
            px-4
            py-2
            text-sm
          "
              >
                Close
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 text-sm mb-2">Email</p>

                <p>{selectedLead.email}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-2">Company</p>

                <p>{selectedLead.company_name}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-2">Status</p>

                <p className="capitalize">{selectedLead.status}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-2">Created</p>

                <p>{new Date(selectedLead.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Lead Assignment */}
            <div className="mt-8">
              <p className="text-gray-400 mb-3">Assigned Team Member</p>

              <select
                value={selectedLead.assigned_to || ""}
                onChange={async (e) => {
                  const assignedUser = e.target.value;

                  await supabase
                    .from("waitlist")
                    .update({
                      assigned_to: assignedUser,
                    })
                    .eq("id", selectedLead.id);

                  await supabase.from("lead_activities").insert({
                    lead_id: selectedLead.id,
                    activity: "Lead assigned to team member",
                  });

                  fetchLeads();
                  fetchActivities(selectedLead.id);
                }}
                className="
      w-full
      rounded-2xl
      border
      border-white/10
      bg-black
      px-4
      py-4
      text-white
      outline-none
    "
              >
                <option value="">Unassigned</option>

                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Follow Up */}
            <div className="mt-8">
              <p className="text-gray-400 mb-3">Follow-up Reminder</p>

              <input
                type="datetime-local"
                defaultValue={
                  selectedLead.follow_up_date
                    ? new Date(selectedLead.follow_up_date)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                onChange={async (e) => {
                  await supabase
                    .from("waitlist")
                    .update({
                      follow_up_date: e.target.value,
                    })
                    .eq("id", selectedLead.id);

                  await supabase.from("lead_activities").insert({
                    lead_id: selectedLead.id,
                    activity: `Follow-up reminder scheduled`,
                  });

                  fetchLeads();
                  fetchActivities(selectedLead.id);
                }}
                className="
      w-full
      rounded-2xl
      border
      border-white/10
      bg-black
      px-4
      py-4
      text-white
      outline-none
    "
              />
            </div>

            {/* Notes */}
            <div className="mt-8">
              <p className="text-gray-400 mb-3">Internal Notes</p>

              <textarea
                defaultValue={selectedLead.notes || ""}
                onBlur={async (e) => {
                  await supabase
                    .from("waitlist")
                    .update({
                      notes: e.target.value,
                    })
                    .eq("id", selectedLead.id);

                  await supabase.from("lead_activities").insert({
                    lead_id: selectedLead.id,
                    activity: "Internal notes updated",
                  });

                  fetchLeads();
                  fetchActivities(selectedLead.id);
                }}
                className="
            w-full
            rounded-2xl
            border
            border-white/10
            bg-black
            p-4
            text-white
            outline-none
            min-h-[150px]
          "
                placeholder="Add follow-up notes..."
              />
            </div>

            <button
              onClick={async () => {
                setAiLoading(true);

                const response = await fetch("/api/ai-qualification", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    full_name: selectedLead.full_name,
                    company_name: selectedLead.company_name,
                    status: selectedLead.status,
                    notes: selectedLead.notes || "",
                  }),
                });

                const data = await response.json();

                setAiResult(data.result);
                fetchLeads();
                await supabase
                  .from("waitlist")
                  .update({
                    ai_summary: data.result,
                    ai_score: data.ai_score,
                    deal_probability: data.deal_probability,
                  })
                  .eq("id", selectedLead.id);

                setAiLoading(false);
              }}
              className="
mt-6
w-full
rounded-2xl
bg-white/5
border
border-white/10
py-4
font-semibold
text-gray-500
cursor-not-allowed
disabled
"
            >
              AI Qualification (Pro)
            </button>
            <button
              onClick={async () => {
                setFollowupLoading(true);

                const response = await fetch("/api/generate-followup", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    full_name: selectedLead.full_name,
                    company_name: selectedLead.company_name,
                    status: selectedLead.status,
                    notes: selectedLead.notes || "",
                  }),
                });

                const data = await response.json();

                setFollowupResult(data.result);

                setFollowupLoading(false);
              }}
              className="
    mt-4
    w-full
    rounded-2xl
    border
    border-white/10
    bg-white/[0.05]
    py-4
    font-semibold
  "
            >
              {followupLoading ? "Generating..." : "Generate Follow-Up"}
            </button>
            {followupResult && (
              <div
                className="
      mt-6
      rounded-2xl
      border
      border-white/10
      bg-white/[0.03]
      p-5
      whitespace-pre-wrap
      text-sm
    "
              >
                {followupResult}
              </div>
            )}
            {aiResult && (
              <div
                className="
      mt-6
      rounded-2xl
      border
      border-green-500/20
      bg-green-500/5
      p-5
      whitespace-pre-wrap
      text-sm
      text-green-100
    "
              >
                {aiResult}
              </div>
            )}
            {selectedLead.ai_summary && !aiResult && (
              <div
                className="
      mt-6
      rounded-2xl
      border
      border-green-500/20
      bg-green-500/5
      p-5
      whitespace-pre-wrap
      text-sm
      text-green-100
    "
              >
                {selectedLead.ai_summary}
              </div>
            )}
            {/* Activity Feed */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Activity Timeline</h3>

                <span className="text-xs text-gray-500">Live CRM activity</span>
              </div>

              <div className="space-y-3">
                {activities.length === 0 ? (
                  <div
                    className="
          rounded-2xl
          border
          border-white/10
          bg-white/[0.03]
          p-4
          text-sm
          text-gray-400
        "
                  >
                    No activity yet.
                  </div>
                ) : (
                  activities.map((item) => (
                    <div
                      key={item.id}
                      className="
            rounded-2xl
            border
            border-white/10
            bg-white/[0.03]
            p-4
          "
                    >
                      <p className="text-sm">{item.activity}</p>

                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
