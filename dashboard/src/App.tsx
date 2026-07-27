import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  Card,
  CardContent,
  IconButton,
  Badge,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Warning as WarningIcon,
  Emergency as EmergencyIcon,
  Group as GroupIcon,
  Assessment as AnalyticsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
  LocationOn as LocationIcon,
  CloudQueue as WeatherIcon,
  Schedule as ClockIcon,
  Send as SendIcon,
  VerifiedUser as ShieldIcon,
  LocalHospital as HospitalIcon,
  LocalFireDepartment as FireIcon,
  LocalPolice as PoliceIcon,
  Image as ImageIcon,
  Movie as MovieIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { GoSafeCommandTheme } from './theme';
import {
  INITIAL_STATS,
  INITIAL_INCIDENTS,
  INITIAL_AI_RISK_ZONES,
  INITIAL_SOS_QUEUE,
  INITIAL_RESOURCES,
  INITIAL_VOLUNTEERS,
  INITIAL_TIMELINE,
} from './data';
import type { LiveIncidentMarker, SosQueueItem, ResourceUnit } from './data';

const drawerWidth = 240;

const CHART_COLORS = ['#0D47A1', '#EF6C00', '#2E7D32', '#9C27B0', '#00BCD4'];
const PIE_COLORS = ['#2E7D32', '#EF6C00', '#D32F2F'];

export default function App() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'INCIDENTS' | 'SOS' | 'COMMUNITY' | 'RESOURCES' | 'ANALYTICS' | 'SETTINGS'>('DASHBOARD');
  
  // Real-time states
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [stats, setStats] = useState(INITIAL_STATS);
  const [incidents] = useState<LiveIncidentMarker[]>(INITIAL_INCIDENTS);
  const [sosQueue, setSosQueue] = useState<SosQueueItem[]>(INITIAL_SOS_QUEUE);
  const [resources, setResources] = useState<ResourceUnit[]>(INITIAL_RESOURCES);
  const [volunteers] = useState(INITIAL_VOLUNTEERS);
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE);
  const [riskZones] = useState(INITIAL_AI_RISK_ZONES);

  // Selected details drawer
  const [selectedIncident, setSelectedIncident] = useState<LiveIncidentMarker | null>(null);

  // Broadcast states
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('ALL');

  // Assign menu state
  const [assignAnchorEl, setAssignAnchorEl] = useState<null | HTMLElement>(null);
  const [activeSosToAssign, setActiveSosToAssign] = useState<SosQueueItem | null>(null);

  // Auto time update
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Dispatch Logics ---
  const handleAssignUnit = (sos: SosQueueItem, unit: ResourceUnit) => {
    // 1. Update Resource status
    setResources((prev) =>
      prev.map((r) => (r.id === unit.id ? { ...r, status: 'BUSY' } : r))
    );

    // 2. Update SOS status
    setSosQueue((prev) =>
      prev.map((s) =>
        s.id === sos.id ? { ...s, status: 'DISPATCHED', assignedUnit: unit.name } : s
      )
    );

    // 3. Log timeline action
    const newLog = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString(),
      action: `${unit.name} dispatched to assist ${sos.citizenName} at ${sos.location}`,
      status: 'DISPATCHED',
      team: unit.type,
    };
    setTimeline((prev) => [newLog, ...prev]);

    // 4. Update Stats counters
    setStats((prev) =>
      prev.map((st) => {
        if (st.title === 'Pending Incident Reports') return { ...st, count: st.count + 1 };
        if (st.title.includes(unit.type.split(' ')[0])) return { ...st, count: Math.max(0, st.count - 1) };
        return st;
      })
    );

    setAssignAnchorEl(null);
    AlertMessage(`Dispatched ${unit.name}`, `Emergency route locked. Estimated Arrival: 4 min.`);
  };

  const handleResolveSos = (sos: SosQueueItem) => {
    setSosQueue((prev) =>
      prev.map((s) => (s.id === sos.id ? { ...s, status: 'RESOLVED' } : s))
    );

    // Free resources that were assigned
    if (sos.assignedUnit) {
      setResources((prev) =>
        prev.map((r) => (r.name === sos.assignedUnit ? { ...r, status: 'AVAILABLE' } : r))
      );
    }

    // Log timeline
    const newLog = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString(),
      action: `SOS Alarm for ${sos.citizenName} resolved successfully.`,
      status: 'RESOLVED',
      team: 'Control Room',
    };
    setTimeline((prev) => [newLog, ...prev]);

    // Update Stats
    setStats((prev) =>
      prev.map((st) => {
        if (st.title === 'Active SOS Alarms') return { ...st, count: Math.max(0, st.count - 1) };
        if (st.title === 'Resolved Cases (Today)') return { ...st, count: st.count + 1 };
        return st;
      })
    );

    AlertMessage('SOS Alert Resolved', 'Marked secure. Logs archived.');
  };

  const handleRejectSos = (sos: SosQueueItem) => {
    setSosQueue((prev) =>
      prev.map((s) => (s.id === sos.id ? { ...s, status: 'FALSE_ALARM' } : s))
    );

    // Free resources
    if (sos.assignedUnit) {
      setResources((prev) =>
        prev.map((r) => (r.name === sos.assignedUnit ? { ...r, status: 'AVAILABLE' } : r))
      );
    }

    // Update Stats
    setStats((prev) =>
      prev.map((st) => {
        if (st.title === 'Active SOS Alarms') return { ...st, count: Math.max(0, st.count - 1) };
        return st;
      })
    );

    AlertMessage('False Alarm Rejected', 'Incident tagged as false trigger. Safety indexes updated.');
  };

  const handleTriggerBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    AlertMessage(
      `Broadcast Alarm Sent`,
      `Message: "${broadcastMessage}" successfully pushed to target: ${broadcastTarget}.`
    );
    setBroadcastMessage('');
  };

  const AlertMessage = (title: string, msg: string) => {
    alert(`${title}\n${msg}`);
  };

  const getSeverityBadgeColor = (sev: string) => {
    switch (sev) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'primary';
      default: return 'success';
    }
  };

  const getResourceStatusChipColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'success';
      case 'BUSY': return 'warning';
      default: return 'default';
    }
  };

  // Recharts analytic data mapping
  const responseTimeData = [
    { name: '18:00', police: 6.2, medical: 8.5, fire: 10.2 },
    { name: '18:15', police: 5.8, medical: 7.8, fire: 9.8 },
    { name: '18:30', police: 5.5, medical: 7.2, fire: 9.5 },
    { name: '18:45', police: 4.8, medical: 6.8, fire: 9.0 },
    { name: '19:00', police: 4.2, medical: 6.5, fire: 8.4 },
  ];

  const incidentTrendData = [
    { name: 'Accidents', count: 18, color: '#0D47A1' },
    { name: 'Fires', count: 4, color: '#F4511E' },
    { name: 'Floods', count: 8, color: '#1E88E5' },
    { name: 'Crimes', count: 14, color: '#D32F2F' },
    { name: 'Medical', count: 22, color: '#00897B' },
  ];

  const distributionData = [
    { name: 'Resolved', value: 48 },
    { name: 'Pending', value: 12 },
    { name: 'SOS Active', value: 3 },
  ];

  return (
    <ThemeProvider theme={GoSafeCommandTheme}>
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        
        {/* Modern Command Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#1A1C1E', color: '#E2E2E6' },
          }}
        >
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#0D47A1', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
              <ShieldIcon sx={{ color: '#fff' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
              GoSafe Command
            </Typography>
          </Box>
          <Box sx={{ overflow: 'auto', flex: 1, py: 2 }}>
            <List>
              {[
                { tab: 'DASHBOARD', label: 'Dashboard', icon: <DashboardIcon /> },
                { tab: 'SOS', label: 'SOS Queue', icon: <Badge badgeContent={stats[0].count} color="error"><EmergencyIcon /></Badge> },
                { tab: 'INCIDENTS', label: 'Incidents Log', icon: <Badge badgeContent={stats[1].count} color="warning"><WarningIcon /></Badge> },
                { tab: 'RESOURCES', label: 'Resources', icon: <GroupIcon /> },
                { tab: 'COMMUNITY', label: 'Community Mesh', icon: <GroupIcon /> },
                { tab: 'ANALYTICS', label: 'Analytics', icon: <AnalyticsIcon /> },
                { tab: 'SETTINGS', label: 'Settings', icon: <SettingsIcon /> },
              ].map((item) => (
                <ListItem key={item.tab} disablePadding>
                  <ListItemButton
                    selected={activeTab === item.tab}
                    onClick={() => setActiveTab(item.tab as any)}
                    sx={{
                      mx: 1.5,
                      my: 0.5,
                      borderRadius: 2,
                      color: activeTab === item.tab ? '#fff' : '#C4C6D0',
                      backgroundColor: activeTab === item.tab ? 'rgba(13, 71, 161, 0.4)' : 'transparent',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                      '&.Mui-selected:hover': { backgroundColor: 'rgba(13, 71, 161, 0.5)' },
                    }}
                  >
                    <ListItemIcon sx={{ color: activeTab === item.tab ? '#fff' : '#C4C6D0', minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText>
                      <Typography sx={{ fontSize: 14, fontWeight: activeTab === item.tab ? 700 : 500 }}>
                        {item.label}
                      </Typography>
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          
          <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 1, color: '#8E9099', px: 1 }}>
              OPERATOR ROLE: ADMIN
            </Typography>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => AlertMessage('Log Out', 'System sessions terminated safely.')}
                sx={{ borderRadius: 2, color: '#FFB4AB', '&:hover': { backgroundColor: 'rgba(255,180,171,0.08)' } }}
              >
                <ListItemIcon sx={{ color: '#FFB4AB', minWidth: 40 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                    Log Out
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Box>
        </Drawer>

        {/* Main Work Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          
          {/* Top Bar Header */}
          <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationIcon fontSize="small" color="primary" /> Delhi/NCR Control Room
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WeatherIcon fontSize="small" color="warning" /> Cloudy, 29°C
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Chip
                  icon={<EmergencyIcon style={{ color: '#D32F2F' }} />}
                  label={`${stats[0].count} ACTIVE SOS`}
                  color="error"
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                  <ClockIcon fontSize="small" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{time}</Typography>
                </Box>
                
                <Divider orientation="vertical" variant="middle" flexItem />
                
                <IconButton color="primary">
                  <Badge badgeContent={stats[1].count} color="warning">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Chief Supervisor Negi
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Tab Pages Scrollable View */}
          <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
            {activeTab === 'DASHBOARD' && (
              <Grid container spacing={3}>
                
                {/* Large MD3 statistics row */}
                {stats.map((stat, idx) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3, lg: 1.7 }} key={idx}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifySelf: 'center', justifyContent: 'center' }}>
                      <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1.5, borderRadius: 3, backgroundColor: stat.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {stat.title.includes('SOS') && <EmergencyIcon sx={{ color: stat.color }} />}
                          {stat.title.includes('Pending') && <WarningIcon sx={{ color: stat.color }} />}
                          {stat.title.includes('Resolved') && <ShieldIcon sx={{ color: stat.color }} />}
                          {stat.title.includes('Patrols') && <PoliceIcon sx={{ color: stat.color }} />}
                          {stat.title.includes('Ambulances') && <HospitalIcon sx={{ color: stat.color }} />}
                          {stat.title.includes('Fire') && <FireIcon sx={{ color: stat.color }} />}
                          {stat.title.includes('Volunteers') && <GroupIcon sx={{ color: stat.color }} />}
                        </Box>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{stat.count}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>{stat.title}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}

                {/* LIVE INCIDENT MAP (Grid Canvas representation) */}
                <Grid size={{ xs: 12, lg: 8 }}>
                  <Card sx={{ height: 480, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        📍 GIS City Incident Monitor Grid
                      </Typography>
                      <Chip label="Live Feed Active" color="success" size="small" variant="filled" />
                    </Box>
                    <Box sx={{ flex: 1, backgroundColor: '#ECEFF1', position: 'relative', overflow: 'hidden' }}>
                      
                      {/* Grid overlay design representing streets */}
                      <Box sx={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.1, backgroundImage: 'radial-gradient(#0D47A1 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                      
                      {/* Mock Streets blocks outlines */}
                      <Box sx={{ position: 'absolute', top: '10%', left: '15%', width: '25%', height: '30%', border: '1px dashed #78909c', borderRadius: 2 }} />
                      <Box sx={{ position: 'absolute', top: '55%', left: '10%', width: '30%', height: '25%', border: '1px dashed #78909c', borderRadius: 2 }} />
                      <Box sx={{ position: 'absolute', top: '20%', left: '55%', width: '35%', height: '40%', border: '1px dashed #78909c', borderRadius: 2 }} />

                      {/* Map Incident Markers */}
                      {incidents.map((marker) => (
                        <Box
                          key={marker.id}
                          onClick={() => setSelectedIncident(marker)}
                          sx={{
                            position: 'absolute',
                            top: `${marker.lat}%`,
                            left: `${marker.lng}%`,
                            cursor: 'pointer',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10,
                          }}
                        >
                          {/* Pulsing indicator background */}
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: `${getSeverityBadgeColor(marker.severity) === 'error' ? '#D32F2F' : getSeverityBadgeColor(marker.severity) === 'warning' ? '#EF6C00' : '#0D47A1'}20`,
                              animation: 'pulse 1.8s infinite ease-in-out',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Box
                              sx={{
                                width: 14,
                                height: 14,
                                borderRadius: '50%',
                                backgroundColor: getSeverityBadgeColor(marker.severity) === 'error' ? '#D32F2F' : getSeverityBadgeColor(marker.severity) === 'warning' ? '#EF6C00' : '#0D47A1',
                                border: '2px solid #FFF',
                              }}
                            />
                          </Box>
                          <Paper sx={{ p: 0.5, position: 'absolute', left: 24, top: -10, display: 'flex', whiteSpace: 'nowrap', zIndex: 12 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{marker.type} ({marker.id})</Typography>
                          </Paper>
                        </Box>
                      ))}
                    </Box>
                  </Card>
                </Grid>

                {/* AI RISK ANALYTICS PANEL */}
                <Grid size={{ xs: 12, lg: 4 }}>
                  <Card sx={{ height: 480, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#5E35B1' }}>
                        🤖 GoSafe AI Risk Forecast
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2, overflowY: 'auto', flex: 1 }}>
                      {riskZones.map((zone) => (
                        <Box
                          key={zone.id}
                          sx={{
                            mb: 2,
                            p: 1.5,
                            borderRadius: 3,
                            backgroundColor: zone.riskLevel === 'HIGH' ? '#FFEBEE' : zone.riskLevel === 'MEDIUM' ? '#FFF3E0' : '#E8F5E9',
                            border: '1px solid',
                            borderColor: zone.riskLevel === 'HIGH' ? '#FFCDD2' : zone.riskLevel === 'MEDIUM' ? '#FFE0B2' : '#C8E6C9',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: zone.riskLevel === 'HIGH' ? '#C62828' : zone.riskLevel === 'MEDIUM' ? '#E65100' : '#2E7D32' }}>
                              {zone.area}
                            </Typography>
                            <Chip
                              label={zone.riskLevel + ' RISK'}
                              size="small"
                              color={zone.riskLevel === 'HIGH' ? 'error' : zone.riskLevel === 'MEDIUM' ? 'warning' : 'success'}
                              sx={{ height: 18, fontSize: 8, fontWeight: 'bold' }}
                            />
                          </Box>
                          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                            Type: {zone.type}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 12 }}>
                            {zone.alert}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Card>
                </Grid>

                {/* TIMELINE ACTIVITY LOG */}
                <Grid size={{ xs: 12 }}>
                  <Card>
                    <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        ⏱ Dispatch Center Activity Feed & Audit logs
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <TableContainer component={Paper} elevation={0}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ backgroundColor: '#f4f6f9' }}>
                              <TableCell sx={{ fontWeight: 'bold' }}>Timestamp</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Action logged</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Division</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>State</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {timeline.map((log) => (
                              <TableRow key={log.id}>
                                <TableCell sx={{ fontWeight: 'bold', width: 120 }}>{log.time}</TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell>{log.team}</TableCell>
                                <TableCell>
                                  <Chip label={log.status} size="small" color={log.status === 'COMPLETED' || log.status === 'RESOLVED' ? 'success' : 'warning'} />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </Card>
                </Grid>

              </Grid>
            )}

            {/* SOS QUEUE PAGE */}
            {activeTab === 'SOS' && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Active Emergency SOS Incoming Queue
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f4f6f9' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Citizen</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Emergency Type</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Time Triggered</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Battery</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sosQueue.map((sos) => (
                        <TableRow key={sos.id} hover>
                          <TableCell sx={{ fontWeight: 'bold' }}>{sos.citizenName}</TableCell>
                          <TableCell>
                            <Chip
                              icon={<EmergencyIcon />}
                              label={sos.emergencyType}
                              color={sos.emergencyType === 'Crime' ? 'error' : sos.emergencyType === 'Medical' ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{sos.location}</TableCell>
                          <TableCell>{sos.time}</TableCell>
                          <TableCell>{sos.battery}</TableCell>
                          <TableCell>
                            <Chip
                              label={sos.status}
                              size="small"
                              color={sos.status === 'PENDING' ? 'error' : sos.status === 'DISPATCHED' ? 'warning' : 'success'}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {sos.status === 'PENDING' && (
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={(e) => {
                                  setAssignAnchorEl(e.currentTarget);
                                  setActiveSosToAssign(sos);
                                }}
                                sx={{ mr: 1 }}
                              >
                                Assign Unit
                              </Button>
                            )}
                            {sos.status === 'DISPATCHED' && (
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() => handleResolveSos(sos)}
                                sx={{ mr: 1 }}
                              >
                                Resolve
                              </Button>
                            )}
                            {sos.status !== 'RESOLVED' && sos.status !== 'FALSE_ALARM' && (
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => handleRejectSos(sos)}
                              >
                                False Alarm
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* INCIDENTS LOG */}
            {activeTab === 'INCIDENTS' && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Reports Incident Registry logs
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f4f6f9' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Incident ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Severity</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Reporter</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Assigned Units</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Logged At</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {incidents.map((incident) => (
                        <TableRow key={incident.id} hover>
                          <TableCell sx={{ fontWeight: 'bold' }}>{incident.id}</TableCell>
                          <TableCell>{incident.title}</TableCell>
                          <TableCell>{incident.type}</TableCell>
                          <TableCell>
                            <Chip
                              label={incident.severity}
                              color={getSeverityBadgeColor(incident.severity)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{incident.reporter}</TableCell>
                          <TableCell>{incident.assignedUnit}</TableCell>
                          <TableCell>{incident.time}</TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => setSelectedIncident(incident)}
                            >
                              Inspect
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* RESOURCES LIST */}
            {activeTab === 'RESOURCES' && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Emergency dispatch Units Status Grid
                </Typography>
                <Grid container spacing={3}>
                  {resources.map((unit) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={unit.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {unit.type.includes('Police') && <PoliceIcon color="primary" />}
                              {unit.type.includes('Ambulance') && <HospitalIcon color="success" />}
                              {unit.type.includes('Fire') && <FireIcon color="error" />}
                              <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                                {unit.name}
                              </Typography>
                            </Box>
                            <Chip
                              label={unit.status}
                              color={getResourceStatusChipColor(unit.status)}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                            Vehicle Type: {unit.type}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                            Operator: {unit.operator}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            Call Sign: {unit.contact}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant={unit.status === 'AVAILABLE' ? 'contained' : 'outlined'}
                              color="success"
                              onClick={() => {
                                setResources((prev) =>
                                  prev.map((r) => (r.id === unit.id ? { ...r, status: 'AVAILABLE' } : r))
                                );
                              }}
                              sx={{ flex: 1 }}
                            >
                              Set Free
                            </Button>
                            <Button
                              size="small"
                              variant={unit.status === 'BUSY' ? 'contained' : 'outlined'}
                              color="warning"
                              onClick={() => {
                                setResources((prev) =>
                                  prev.map((r) => (r.id === unit.id ? { ...r, status: 'BUSY' } : r))
                                );
                              }}
                              sx={{ flex: 1 }}
                            >
                              Set Busy
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* COMMUNITY MESH */}
            {activeTab === 'COMMUNITY' && (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Card sx={{ height: '100%' }}>
                    <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Nearby Volunteers Register
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <TableContainer component={Paper} elevation={0}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ backgroundColor: '#f4f6f9' }}>
                              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Badge/Role</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Distance</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {volunteers.map((vol) => (
                              <TableRow key={vol.id}>
                                <TableCell sx={{ fontWeight: 'bold' }}>{vol.name}</TableCell>
                                <TableCell>{vol.badge}</TableCell>
                                <TableCell>{vol.distance}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={vol.status}
                                    color={vol.status === 'ACTIVE' ? 'error' : vol.status === 'ONLINE' ? 'success' : 'default'}
                                    size="small"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                  <Card sx={{ height: '100%' }}>
                    <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Emergency Area Broadcast Channels
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <form onSubmit={handleTriggerBroadcast}>
                        <Box sx={{ mb: 2 }}>
                          <TextField
                            label="Broadcast Target Radius"
                            select
                            fullWidth
                            size="small"
                            value={broadcastTarget}
                            onChange={(e) => setBroadcastTarget(e.target.value)}
                          >
                            <MenuItem value="ALL">All Registered citizens</MenuItem>
                            <MenuItem value="VOLUNTEERS">Mesh Safety Volunteers only</MenuItem>
                            <MenuItem value="SECTOR_4">Sector 4 Residents Corridor</MenuItem>
                          </TextField>
                        </Box>
                        <Box sx={{ mb: 3 }}>
                          <TextField
                            label="Distress warning message"
                            multiline
                            rows={4}
                            fullWidth
                            placeholder="Type emergency alert details..."
                            value={broadcastMessage}
                            onChange={(e) => setBroadcastMessage(e.target.value)}
                          />
                        </Box>
                        <Button
                          type="submit"
                          variant="contained"
                          color="error"
                          endIcon={<SendIcon />}
                          fullWidth
                        >
                          Broadcast Distress Notice
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* ANALYTICS TABS */}
            {activeTab === 'ANALYTICS' && (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Control Room dispatch Response Time (mins)
                    </Typography>
                    <Box sx={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <LineChart data={responseTimeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="police" stroke="#0D47A1" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="medical" stroke="#00897B" />
                          <Line type="monotone" dataKey="fire" stroke="#D32F2F" />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Case Resolution logs distribution
                    </Typography>
                    <Box sx={{ width: '100%', height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={distributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {distributionData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Typography variant="caption" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>Resolved (48)</Typography>
                        <Typography variant="caption" sx={{ color: '#EF6C00', fontWeight: 'bold' }}>Pending (12)</Typography>
                        <Typography variant="caption" sx={{ color: '#D32F2F', fontWeight: 'bold' }}>Active SOS (3)</Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Daily Incident Severity volume by Category
                    </Typography>
                    <Box sx={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <BarChart data={incidentTrendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#0D47A1">
                            {incidentTrendData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* SETTINGS PAGE */}
            {activeTab === 'SETTINGS' && (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card>
                    <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Command center Department Links
                      </Typography>
                    </Box>
                    <CardContent>
                      <List>
                        <ListItem>
                          <ListItemIcon><PoliceIcon /></ListItemIcon>
                          <ListItemText primary="Police Department Link" secondary="Active connection: 24/7 sync" />
                          <Chip label="Connected" color="success" size="small" />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon><HospitalIcon /></ListItemIcon>
                          <ListItemText primary="Hospital emergency medical Link" secondary="Active connection: ambulance tracking" />
                          <Chip label="Connected" color="success" size="small" />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon><FireIcon /></ListItemIcon>
                          <ListItemText primary="Fire Department dispatch link" secondary="Active connection: standby networks" />
                          <Chip label="Connected" color="success" size="small" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card>
                    <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Roles & Permission Matrix
                      </Typography>
                    </Box>
                    <CardContent>
                      <List>
                        <ListItem>
                          <ListItemText primary="Chief Supervisor (Admin)" secondary="Full read, write, dispatch, and system configurations permissions." />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText primary="Emergency Dispatcher (Operator)" secondary="Access to SOS queue routing and responder assignment actions." />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText primary="Auditor Role (Read-only)" secondary="Access to analytics charts and history timeline summaries." />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
        </Box>
      </Box>

      {/* --- Dialogue and Menu Modals --- */}

      {/* Dropdown menu simulator for assigning resource units to active SOS queues */}
      <Menu
        anchorEl={assignAnchorEl}
        open={Boolean(assignAnchorEl)}
        onClose={() => setAssignAnchorEl(null)}
      >
        <MenuItem disabled sx={{ fontWeight: 'bold' }}>Select Available Unit</MenuItem>
        <Divider />
        {resources
          .filter((r) => r.status === 'AVAILABLE')
          .map((unit) => (
            <MenuItem
              key={unit.id}
              onClick={() => {
                if (activeSosToAssign) {
                  handleAssignUnit(activeSosToAssign, unit);
                }
              }}
            >
              {unit.name} ({unit.type})
            </MenuItem>
        ))}
      </Menu>

      {/* Inspect Incident Details Dialog Modal */}
      <Dialog
        open={Boolean(selectedIncident)}
        onClose={() => setSelectedIncident(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedIncident && (
          <>
            <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Inspect Incident Details ({selectedIncident.id})
              <Chip label={selectedIncident.severity} color={getSeverityBadgeColor(selectedIncident.severity)} />
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                {selectedIncident.title}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">LOGGED AT</Typography>
                  <Typography variant="body2">{selectedIncident.time}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">REPORTER</Typography>
                  <Typography variant="body2">{selectedIncident.reporter}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">MAP COORDS</Typography>
                  <Typography variant="body2">Lat: {selectedIncident.lat}%, Lng: {markerPercentToCoord(selectedIncident.lng)}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">WITNESSES LOGGED</Typography>
                  <Typography variant="body2">{selectedIncident.witnessCount} nearby witnesses</Typography>
                </Grid>
              </Grid>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">WITNESS EVIDENCE LOGS</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  <Paper sx={{ p: 1, backgroundColor: '#f4f6f9', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ImageIcon sx={{ color: '#0D47A1', fontSize: 20 }} />
                    <Typography variant="caption">collision_car_rear.jpg</Typography>
                  </Paper>
                  <Paper sx={{ p: 1, backgroundColor: '#f4f6f9', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MovieIcon sx={{ color: '#E65100', fontSize: 20 }} />
                    <Typography variant="caption">tunnel_flood_video.mp4</Typography>
                  </Paper>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">ASSIGNED FORCES</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{selectedIncident.assignedUnit}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">INCIDENT CHRONICLE DETAIL</Typography>
                <Typography variant="body2">{selectedIncident.details}</Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedIncident(null)}>Close Inspection</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </ThemeProvider>
  );
}

// Coordinate percent converters
function markerPercentToCoord(percent: number) {
  return (77.0 + percent / 100).toFixed(4);
}
