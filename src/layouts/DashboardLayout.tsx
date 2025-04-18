import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell, Group, Title, ActionIcon, Menu, Avatar, Box, Text, UnstyledButton, rem } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  IconLogout, 
  IconUser,
  IconSun,
  IconMoon,
  IconBell
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useMantineColorScheme } from '@mantine/core';
import FarmerSidebar from '../components/FarmerSidebar';
import TechnicianSidebar from '../components/TechnicianSidebar';
import AdminSidebar from '../components/AdminSidebar';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { setColorScheme } = useMantineColorScheme();
  
  const handleLogout = () => {
    logout();
  };
  
  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    setColorScheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Fonction pour rendre la sidebar appropriée en fonction du rôle de l'utilisateur
  const renderSidebar = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'admin':
        return <AdminSidebar />;
      case 'technician':
        return <TechnicianSidebar />;
      case 'farmer':
      default:
        return <FarmerSidebar />;
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
      layout="alt"
      styles={{
        main: {
          background: theme === 'dark' ? '#121212' : '#f8f9fa',
        },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Title order={3} c="plum">Classification des Prunes</Title>
          </Group>
          <Group>
            <ActionIcon 
              variant="default" 
              onClick={handleToggleTheme} 
              aria-label="Changer de thème"
            >
              {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
            <ActionIcon variant="default" aria-label="Notifications">
              <IconBell size={18} />
            </ActionIcon>
            <Menu position="bottom-end" withArrow shadow="md">
              <Menu.Target>
                <UnstyledButton>
                  <Group>
                    <Avatar color="plum" radius="xl">
                      {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                    </Avatar>
                    <Box style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>
                        {user?.first_name && user?.last_name 
                          ? `${user.first_name} ${user.last_name}` 
                          : user?.username}
                      </Text>
                      <Text c="dimmed" size="xs">
                        {user?.email}
                      </Text>
                    </Box>
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Compte</Menu.Label>
                <Menu.Item leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />} onClick={() => navigate('/profile')}>
                  Mon profil
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item 
                  color="red" 
                  leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                  onClick={handleLogout}
                >
                  Se déconnecter
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>
      
      <div className="flex h-[calc(100vh-60px)]">
        {/* Utiliser la sidebar appropriée en fonction du rôle */}
        <div className="w-[280px] h-full">
          {renderSidebar()}
        </div>
        
        <AppShell.Main className="flex-1 overflow-auto">
          <Outlet />
        </AppShell.Main>
      </div>
    </AppShell>
  );
}

export default DashboardLayout;
