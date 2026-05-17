import { Save } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { showErrorToast } from '#/components/Toast'
import {
  BooleanField,
  TextareaField,
  TextField,
} from '#/components/dashboard/AdminFormFields'
import { Badge } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { adminArticleCreateInputSchema } from '#/lib/schemas/admin-article'

import type { AdminArticleRow } from '#/server/repositories/admin.repo'
import type { FormEvent, ReactElement } from 'react'

export interface AdminArticleFormValue {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  subCategory: string
  author: string
  imageUrl: string
  premium: boolean
  dealTag: string
  publishedAt: string
}

interface AdminArticleFormProps {
  editingArticle: AdminArticleRow | null
  isPending: boolean
  onCancelEdit: () => void
  onSubmit: (value: AdminArticleFormValue) => void
}

const emptyArticleValue: AdminArticleFormValue = {
  id: '',
  title: '',
  excerpt: '',
  content: '',
  category: 'News',
  subCategory: '',
  author: 'JustMiles Editorial',
  imageUrl: '',
  premium: false,
  dealTag: '',
  publishedAt: '',
}

export function AdminArticleForm({
  editingArticle,
  isPending,
  onCancelEdit,
  onSubmit,
}: AdminArticleFormProps): ReactElement {
  const formId = useId()
  const [value, setValue] = useState<AdminArticleFormValue>(emptyArticleValue)

  useEffect(() => {
    setValue(editingArticle ? toFormValue(editingArticle) : emptyArticleValue)
  }, [editingArticle])

  function updateValue(nextValue: Partial<AdminArticleFormValue>): void {
    setValue((currentValue) => ({ ...currentValue, ...nextValue }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const parsed = adminArticleCreateInputSchema.safeParse(value)

    if (!parsed.success) {
      showErrorToast(parsed.error.issues[0]?.message ?? 'Input belum valid.')
      return
    }

    onSubmit(value)
  }

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="island-kicker">Article editor</p>
            <CardTitle className="font-display text-2xl text-primary">
              {editingArticle ? 'Edit artikel' : 'Tambah artikel'}
            </CardTitle>
          </div>
          <Badge tone={editingArticle ? 'warning' : 'accent'} size="md">
            {editingArticle ? `Editing ${editingArticle.id}` : 'New article'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-3">
            <TextField
              id={`${formId}-id`}
              label="Slug ID"
              value={value.id}
              disabled={editingArticle !== null}
              onChange={(id) => updateValue({ id })}
            />
            <TextField
              id={`${formId}-title`}
              label="Judul"
              value={value.title}
              onChange={(title) => updateValue({ title })}
            />
            <TextField
              id={`${formId}-category`}
              label="Kategori"
              value={value.category}
              onChange={(category) => updateValue({ category })}
            />
            <TextField
              id={`${formId}-sub-category`}
              label="Sub kategori"
              value={value.subCategory}
              onChange={(subCategory) => updateValue({ subCategory })}
            />
            <TextField
              id={`${formId}-author`}
              label="Author"
              value={value.author}
              onChange={(author) => updateValue({ author })}
            />
            <DateField
              id={`${formId}-published-at`}
              label="Published at"
              value={value.publishedAt}
              onChange={(publishedAt) => updateValue({ publishedAt })}
            />
            <TextField
              id={`${formId}-deal-tag`}
              label="Deal tag"
              value={value.dealTag}
              onChange={(dealTag) => updateValue({ dealTag })}
            />
            <TextField
              id={`${formId}-image-url`}
              label="Image URL"
              value={value.imageUrl}
              onChange={(imageUrl) => updateValue({ imageUrl })}
            />
            <BooleanField
              id={`${formId}-premium`}
              label="Premium content"
              checked={value.premium}
              onCheckedChange={(premium) => updateValue({ premium })}
            />
          </div>

          <TextareaField
            id={`${formId}-excerpt`}
            label="Excerpt"
            value={value.excerpt}
            onChange={(excerpt) => updateValue({ excerpt })}
          />
          <TextareaField
            id={`${formId}-content`}
            label="Content editor"
            value={value.content}
            onChange={(content) => updateValue({ content })}
          />

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onCancelEdit}>
              Reset
            </Button>
            <Button type="submit" disabled={isPending}>
              <Save className="h-4 w-4" aria-hidden="true" />
              {isPending ? 'Menyimpan...' : 'Simpan artikel'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

interface DateFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

function DateField({
  id,
  label,
  value,
  onChange,
}: DateFieldProps): ReactElement {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="datetime-local"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

function toFormValue(article: AdminArticleRow): AdminArticleFormValue {
  return {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt ?? '',
    content: article.content ?? '',
    category: article.category,
    subCategory: article.subCategory ?? '',
    author: article.author ?? '',
    imageUrl: article.imageUrl ?? '',
    premium: article.premium,
    dealTag: article.dealTag ?? '',
    publishedAt: formatDateTimeLocal(article.publishedAt),
  }
}

function formatDateTimeLocal(date: Date | null): string {
  if (!date) {
    return ''
  }

  return new Date(date).toISOString().slice(0, 16)
}
