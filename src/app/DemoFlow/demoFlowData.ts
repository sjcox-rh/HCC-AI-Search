export const DEMO_SEARCH_QUERY = 'RHEL 10 migration image mode';

export const RHEL10_MIGRATION_DOC_TITLE = 'Upgrading to RHEL 10 & Adopting Image Mode';

export const RHEL10_MIGRATION_DOC_HEADING =
  'Upgrading to RHEL 10: Requirements & Image Mode Architecture';

export const LIGHTSPEED_CONTEXT_PILL =
  'Context: RHEL 10 Upgrade Guide + 42 Registered RHEL 9 Hosts';

export const ANSIBLE_PLAYBOOK_SNIPPET = `---
- name: Verify x86-64-v3 CPU flags across RHEL hosts
  hosts: rhel_inventory
  gather_facts: true
  tasks:
    - name: Collect CPU flags
      ansible.builtin.shell: |
        grep -m1 '^flags' /proc/cpuinfo | tr ' ' '\\n' | sort -u
      register: cpu_flags
      changed_when: false

    - name: Assert required x86-64-v3 flags (avx, avx2, bmi1, bmi2, fma, movbe)
      ansible.builtin.assert:
        that:
          - "'avx' in cpu_flags.stdout_lines"
          - "'avx2' in cpu_flags.stdout_lines"
          - "'bmi1' in cpu_flags.stdout_lines"
          - "'bmi2' in cpu_flags.stdout_lines"
          - "'fma' in cpu_flags.stdout_lines"
          - "'movbe' in cpu_flags.stdout_lines"
        fail_msg: "Host {{ inventory_hostname }} lacks x86-64-v3 baseline"
        success_msg: "Host {{ inventory_hostname }} meets x86-64-v3 baseline"
`;

export type DemoStep = 1 | 2 | 3;

export const DEMO_STEPS: { step: DemoStep; label: string }[] = [
  { step: 1, label: '1. Search RHEL 10' },
  { step: 2, label: '2. Help Panel Context' },
  { step: 3, label: '3. Lightspeed Fleet Action' },
];

export const PROTOTYPE_VERSION_LABEL = 'V2.2 Search and Help';
