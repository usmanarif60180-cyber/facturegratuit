"use client";

import * as React from "react";
import { MoreHorizontal, Star, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@/components/ui/Dropdown";
import type { ContactPerson } from "@/types";

interface ContactsCardProps {
  contacts: ContactPerson[];
  onAdd: () => void;
  onEdit: (contact: ContactPerson) => void;
  onDelete: (contact: ContactPerson) => void;
}

export function ContactsCard({ contacts, onAdd, onEdit, onDelete }: ContactsCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Contact persons</CardTitle>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={onAdd}>
          <UserPlus className="h-3.5 w-3.5" /> Add
        </Button>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No contacts added yet.</p>
        ) : (
          <ul className="space-y-3">
            {contacts.map((contact) => (
              <li key={contact.id} className="flex items-start justify-between gap-2 border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-sm font-medium">
                    {contact.name}
                    {contact.isPrimary && <Star className="h-3 w-3 fill-warning text-warning" />}
                  </p>
                  {contact.role && <p className="text-xs text-muted-foreground">{contact.role}</p>}
                  {contact.email && <p className="text-xs text-muted-foreground">{contact.email}</p>}
                  {contact.phone && <p className="text-xs text-muted-foreground">{contact.phone}</p>}
                </div>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Contact actions">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem onSelect={() => onEdit(contact)}>Edit</DropdownItem>
                    <DropdownItem onSelect={() => onDelete(contact)} className="text-danger">
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
