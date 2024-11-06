import { useState, forwardRef } from "react";

import {
  rem,
  Collapse,
  Button,
  Menu,
  Table,
  Checkbox,
  ScrollArea,
  Stack,
  Tooltip,
  Flex,
  Group,
  Text,
  Input,
} from "@mantine/core";

import DataTableTabs from "./DataTableTabs";

import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconCheck,
  IconFilter,
  IconSortAscending2Filled,
  IconSortDescending2Filled,
} from "@tabler/icons-react";

import StopIcon from "./icons/StopIcon";
import StartIcon from "./icons/StartIcon";
import PauseIcon from "./icons/PauseIcon";
import DeleteIcon from "./icons/DeleteIcon";
import FilterIcon from "./icons/FilterIcon";
import UnpauseIcon from "./icons/UnpauseIcon";
import RefreshIcon from "./icons/RefreshIcon";

export const ON_DELETE = "onDelete";
export const ON_STOP = "onStop";
export const ON_PAUSE = "onPause";
export const ON_START = "onStart";
export const ON_UNPAUSE = "onUnpause";
export const ON_REFRESH = "onRefresh";

const CommandIcon = forwardRef(({ size, id }, ref) => {
  if (id === ON_STOP) return <StopIcon ref={ref} size={size} />;
  else if (id === ON_START) return <StartIcon ref={ref} size={size} />;
  else if (id === ON_PAUSE) return <PauseIcon ref={ref} size={size} />;
  else if (id === ON_UNPAUSE) return <UnpauseIcon ref={ref} size={size} />;
  else if (id === ON_REFRESH) return <RefreshIcon ref={ref} size={size} />;
  else return <DeleteIcon ref={ref} size={size} />;
});
CommandIcon.displayName = "CommandIcon";

const FilterMenu = () => {
  const [filter, setFilter] = useState();

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button p={0} w={14} h={14} bg="transparent">
          <FilterIcon size={14} />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<IconSortAscending2Filled style={{ width: rem(14), height: rem(14) }} />}>
          Sort Ascending
        </Menu.Item>
        <Menu.Item leftSection={<IconSortDescending2Filled style={{ width: rem(14), height: rem(14) }} />}>
          Sort Descending
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          leftSection={<IconFilter style={{ width: rem(14), height: rem(14) }} />}
          rightSection={<IconCheck style={{ width: rem(14), height: rem(14) }} />}
        >
          <Input
            value={filter}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
FilterMenu.displayName = "FilterMenu";

/**
    Returns 2 DataTableRow instances, if the element has an inspect.
*/
const DataTableRow = ({ schema, row, selected, onChange, inspect }) => {
  const [collapsed, setCollapsed] = useState(true);
  const collapsableRowStyle = { borderBottomWidth: collapsed ? 0 : 1 };

  return (
    <>
      <Table.Tr bg={selected ? "var(--mantine-color-blue-light)" : undefined}>
        <Table.Td>
          <Checkbox aria-label="Select row" checked={selected} onChange={onChange} />
        </Table.Td>
        {schema.fields.map((field, index) => (
          <Table.Td key={`field-${index}`}>{field.displayFn ? field.displayFn(row) : row[field.id]}</Table.Td>
        ))}
        {schema?.inspect !== undefined && (
          <Table.Td>
            <Button p={0} w={14} h={14} bg="transparent" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? (
                <IconCaretDownFilled size={14} color="black" />
              ) : (
                <IconCaretUpFilled size={14} color="black" />
              )}
            </Button>
          </Table.Td>
        )}
      </Table.Tr>
      {schema?.inspect !== undefined && (
        <Table.Tr style={collapsableRowStyle}>
          <Table.Td colSpan={schema.fields.length + 1}>
            <Collapse in={!collapsed}>
              <DataTableTabs id={row[schema.idField]} inspect={schema.inspect} open={!collapsed} />
            </Collapse>
          </Table.Td>
        </Table.Tr>
      )}
    </>
  );
};

export default function DataTable({ title, schema, data, cmds, inspect }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (event) => {
    if (event.currentTarget.checked) {
      setSelectedRows(data.map((row) => row[schema.idField]));
    } else {
      setSelectedRows([]);
    }
    setSelectAll(event.currentTarget.checked);
  };

  const rows = data.map((row, index) => (
    <DataTableRow
      key={`data-table-row-${index}`}
      schema={schema}
      row={row}
      selected={selectedRows.includes(row[schema.idField])}
      inspect={inspect}
      onChange={(event) =>
        setSelectedRows(
          event.currentTarget.checked
            ? [...selectedRows, row[schema.idField]]
            : selectedRows.filter((position) => position !== row[schema.idField]),
        )
      }
    />
  ));

  const handleRefresh = (onRefresh) => {
    setSelectedRows([]);
    setSelectAll(false);
    onRefresh();
  };

  const calcWidth = (field) => {
    let width = field?.width ?? 0;
    if (field?.filtered) width = Math.max(width, 100);
    return width;
  };

  cmds = cmds.map((cmd) => {
    let fn = cmd.id == ON_REFRESH ? () => handleRefresh(cmd.fn) : cmd.fn;
    return { ...cmd, fn };
  });

  return (
    <Stack>
      <Group grow color="light-blue">
        <Text size="xl">{title}</Text>
        <Group gap="md">
          <Text>Search</Text>
          <Input placeholder="Enter search" />
        </Group>
        <Flex gap="md" justify="flex-end">
          {cmds.map((cmd) => (
            <div key={cmd.id} onClick={() => cmd.fn(selectedRows)}>
              <Tooltip label={cmd.label}>
                <CommandIcon id={cmd.id} size={14} />
              </Tooltip>
            </div>
          ))}
        </Flex>
      </Group>
      <ScrollArea>
        <Table.ScrollContainer w={"100%"}>
          <Table stickyHeader>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Checkbox checked={selectAll} onChange={handleSelectAll} aria-label="Select all rows" />
                </Table.Th>
                {schema.fields.map((field, index) => (
                  <Table.Th key={`header-${index}`} miw={calcWidth(field)}>
                    <Group>
                      {field.label}
                      {field?.filtered && <FilterMenu />}
                    </Group>
                  </Table.Th>
                ))}
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows.flat()}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </ScrollArea>
    </Stack>
  );
}
