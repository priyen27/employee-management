import { createServer, Model, Factory, Response } from 'miragejs';
import { Employee } from '../types/employee';

if (process.env.NODE_ENV === "development") {
  makeServer();
}

export function makeServer() {
  return createServer({
    models: {
      employee: Model.extend<Partial<Employee>>({}),
    },

    factories: {
      employee: Factory.extend({
        firstName(i: number) {
          const firstNames = [
            'John', 'Jane', 'Michael', 'Sarah', 'David',
            'Lisa', 'Robert', 'Emma', 'William', 'Olivia'
          ];
          return firstNames[i % firstNames.length];
        },
        lastName(i: number) {
          const lastNames = [
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
            'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'
          ];
          return lastNames[i % lastNames.length];
        },
        email() {
          const firstName = this.firstName as string;
          const lastName = this.lastName as string;
          return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
        },
        position(i: number) {
          const positions = [
            'Software Engineer',
            'Product Manager',
            'UX Designer',
            'QA Engineer',
            'DevOps Engineer'
          ];
          return positions[i % positions.length];
        },
        department(i: number) {
          const departments = [
            'Engineering',
            'Product',
            'Design',
            'QA',
            'Operations'
          ];
          return departments[i % departments.length];
        },
        phoneNumber() {
          const areaCode = Math.floor(100 + Math.random() * 900);
          const prefix = Math.floor(100 + Math.random() * 900);
          const lineNumber = Math.floor(1000 + Math.random() * 9000);
          return `${areaCode}-${prefix}-${lineNumber}`;
        },
        hireDate() {
          const start = new Date(2020, 0, 1).getTime();
          const end = new Date().getTime();
          const randomDate = new Date(start + Math.random() * (end - start));
          return randomDate.toISOString().split('T')[0];
        }
      })
    },

    seeds(server) {
      server.createList('employee', 10);
    },

    routes() {
      this.namespace = 'api';

      this.get('/employees', (schema) => {
        const employees = schema.all('employee');
        return employees.models.map(model => ({
          id: model.id,
          ...model.attrs
        }));
      });

      this.get('/employees/:id', (schema, request) => {
        const { id } = request.params;
        return schema.find('employee', id);
      });

      this.post('/employees', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.create('employee', attrs);
      });

      // @ts-ignore
      this.put('/employees/:id', (schema, request) => {
        const { id } = request.params;
        const attrs = JSON.parse(request.requestBody);
        const employee = schema.find('employee', id);
        if (!employee) {
          return new Response(404, { some: 'header' }, { error: 'Employee not found' });
        }
        return employee.update(attrs);
      });
      
      this.delete('/employees/:id', (schema, request) => {
        const { id } = request.params;
        const employee = schema.find('employee', id);
        if (!employee) {
          return new Response(404, { some: 'header' }, { error: 'Employee not found' });
        }
        employee.destroy();
        return new Response(204);
      });
    },
  });
} 