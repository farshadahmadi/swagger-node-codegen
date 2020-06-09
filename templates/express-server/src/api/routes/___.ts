import { Router, Request, Response, NextFunction } from "express";
import { Service } from "../services/Service";
import { diContainer } from "../diContainer";

const router = Router();

{{#each headOperation}}
  {{#each this.path}}
    {{#validMethod @key}}
/**
 {{#each ../descriptionLines}}
 * {{{this}}}
 {{/each}}
 */
router.{{@key}}('{{../../subresource}}', async (req: Request, res: Response, next: NextFunction) => {
  const optionssss = {
    '{{../../path_name}}'
  {{#if ../requestBody}}
  body: req.body{{#compare (lookup ../parameters 'length') 0 operator = '>' }},{{/compare}}
  {{/if}}
    {{#each ../parameters}}
      {{#equal this.in "query"}}
        {{{quote ../name}}}: req.query['{{../name}}']{{#unless @last}},{{/unless}}
      {{/equal}}
      {{#equal this.in "path"}}
        {{{quote ../name}}}: req.params['{{../name}}']{{#unless @last}},{{/unless}}
      {{/equal}}
      {{#equal this.in "header"}}
        {{{quote ../name}}}: req.header['{{../name}}']{{#unless @last}},{{/unless}}
      {{/equal}}
    {{/each}}
    };

    try {
      const result = await {{camelCase ../../../operation_name}}.{{../operationId}}(options);
      {{#ifNoSuccessResponses ../responses}}
        res.header('X-Result', result.data).status(200).send();
      {{else}}
        res.status(result.status || 200).send(result.data);
      {{/ifNoSuccessResponses}}
      } catch (err) {
      {{#ifNoErrorResponses ../responses}}
        return res.status(500).send({
          status: 500,
          error: 'Server Error'
        });
      {{else}}
      next(err);
      {{/ifNoErrorResponses}}
      }
    });
    {{/validMethod}}
  {{/each}}
{{/each}}

{{#each operation}}
  {{#each this.path}}
    {{#validMethod @key}}
/**
 {{#each ../descriptionLines}}
 * {{{this}}}
 {{/each}}
 */
router.{{@key}}('{{../../subresource}}', async (req: Request, res: Response, next: NextFunction) => {

  {{#if ../requestBody}}
  {{#with ../requestBody.content}}
    {{#with [application/json]}}
  const {{camelCase schema.title}} : Components.Schemas.{{schema.title}} = req.body;
    {{/with}}
  {{/with}}
  {{/if}}

    {{#each ../parameters}}
      {{#equal this.in "query"}}
        {{#equal ../schema.type "object"}}
  const {{../name}} : Components.Schemas.{{../schema.title}} = req.query.{{../name}};
        {{else}}
  const {{../name}} = req.query.{{../name}} as {{../schema.type}}{{#unless ../required}} | null{{/unless}};
        {{/equal}}
      {{/equal}}
      {{#equal this.in "path"}}
  const {{../name}}: {{convertDataType ../schema.type}} = req.params.{{../name}};
      {{/equal}}
      {{#equal this.in "header"}}
    {{{quote ../name}}}: req.header['{{../name}}']{{#unless @last}},{{/unless}}
      {{/equal}}
      {{#match @../key "(post|put)"}}
        {{#equal ../in "body"}}
    {{{quote ../name}}}: req.body['{{../name}}']{{#unless @last}},{{/unless}}
        {{/equal}}
      {{/match}}
    {{/each}}

  const service = diContainer.resolve<Service>(Service);

    {{#ifNoSuccessResponses ../responses}}
    res.status(200).send(result.data);
    {{else}}
    {{#with ../responses}}
      {{#with [200]}}
        {{#with content}}
          {{#with [application/json]}}
            {{#equal schema.type "array"}}
  const {{camelCase ../schema.items.title}}s : Components.Schemas.{{../schema.items.title}}[] = await service.function();
  res.status(200).send({{camelCase ../schema.items.title}}s);
            {{else}}
  const {{camelCase ../schema.title}} : Components.Schemas.{{../schema.title}} = await service.function();
  res.status(200).send({{camelCase ../schema.title}});
            {{/equal}}

          {{/with}}
        {{/with}}
      {{/with}}
    {{/with}}

    {{/ifNoSuccessResponses}}
});

    {{/validMethod}}
  {{/each}}
{{/each}}
export { router };
